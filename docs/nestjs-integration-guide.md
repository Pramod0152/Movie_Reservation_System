# NestJS Swagger, JWT, Sequelize, and Logger Setup Guide

This guide walks through adding interactive API docs (Swagger), JWT-based authentication, Sequelize ORM, and structured logging to a NestJS project. The examples align with the existing structure under `src/` in this repository, but can be adapted to any NestJS application.

---

## 1. Prerequisites

- Node.js 18+ and npm installed on your machine (`node -v`, `npm -v`).
- Nest CLI (optional but recommended):
  ```cmd
  npm i -g @nestjs/cli
  ```
- Existing NestJS project scaffold (e.g. `nest new movie-reservation-system`).
- A running relational database (PostgreSQL is assumed in the examples). Update connection details to match your environment.

---

## 2. Base Project Configuration

1. **Install foundational dependencies**
   ```cmd
   npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt sequelize sequelize-typescript pg pg-hstore @nestjs/sequelize @nestjs/swagger swagger-ui-express
   npm install -D @types/bcrypt
   ```

2. **Enable configuration module**
   - Update `src/app.module.ts` to load environment variables and share them across modules.
   ```typescript
   import { Module } from '@nestjs/common';
   import { ConfigModule } from '@nestjs/config';

   @Module({
     imports: [
       ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: ['.env'],
       }),
       // ...other modules
     ],
   })
   export class AppModule {}
   ```

3. **Environment variables**
   Create a `.env` file (never commit secrets):
   ```env
   NODE_ENV=development
   PORT=3000

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=movie_reservation

   # JWT
   JWT_SECRET=superSecretKey
   JWT_EXPIRES_IN=3600s
   ```

---

## 3. Integrating Swagger (OpenAPI)

1. **Bootstrap Swagger in `main.ts`**
   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
   import { AppModule } from './app.module';

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);

     const config = new DocumentBuilder()
       .setTitle('Movie Reservation API')
       .setDescription('API documentation for Movie Reservation System')
       .setVersion('1.0')
       .addBearerAuth()
       .build();

     const document = SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api/docs', app, document, {
       swaggerOptions: { persistAuthorization: true },
     });

     await app.listen(process.env.PORT || 3000);
   }

   bootstrap();
   ```

2. **Decorate DTOs and routes**
   - Use `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`, etc. in controllers.
   ```typescript
   import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

   @ApiTags('auth')
   @ApiBearerAuth()
   @Controller('auth')
   export class AuthController {
     @Post('login')
     @ApiOperation({ summary: 'Authenticate user and return JWT' })
     @ApiResponse({ status: 200, description: 'Returns an access token.' })
     login(@Body() loginDto: LoginDto) {
       return this.authService.login(loginDto);
     }
   }
   ```

3. **Add DTO metadata**
   ```typescript
   import { ApiProperty } from '@nestjs/swagger';

   export class LoginDto {
     @ApiProperty({ example: 'user@example.com' })
     email: string;

     @ApiProperty({ minLength: 8 })
     password: string;
   }
   ```

4. **Run the application**
   ```cmd
   npm run start:dev
   ```
   Visit `http://localhost:3000/api` to see the Swagger UI.

---

## 4. Configuring JWT Authentication

1. **Auth module scaffolding**
   ```cmd
   nest g module modules/auth
   nest g service modules/auth/auth
   nest g controller modules/auth/auth
   ```

2. **JWT strategy** (`src/modules/auth/strategies/jwt.strategy.ts`)
   ```typescript
   import { Injectable } from '@nestjs/common';
   import { ConfigService } from '@nestjs/config';
   import { PassportStrategy } from '@nestjs/passport';
   import { ExtractJwt, Strategy } from 'passport-jwt';

   export interface JwtPayload {
     sub: number;
     email: string;
   }

   @Injectable()
   export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(private readonly configService: ConfigService) {
       super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: configService.get<string>('JWT_SECRET'),
       });
     }

     async validate(payload: JwtPayload) {
       return { userId: payload.sub, email: payload.email };
     }
   }
   ```

3. **Auth service** (`src/modules/auth/auth.service.ts`)
   ```typescript
   import { Injectable, UnauthorizedException } from '@nestjs/common';
   import { JwtService } from '@nestjs/jwt';
   import * as bcrypt from 'bcrypt';
   import { UsersService } from '../../dal/user.data.service';

   @Injectable()
   export class AuthService {
     constructor(
       private readonly usersService: UsersService,
       private readonly jwtService: JwtService,
     ) {}

     async validateUser(email: string, pass: string) {
       const user = await this.usersService.findByEmail(email);
       if (!user) throw new UnauthorizedException();

       const isMatch = await bcrypt.compare(pass, user.password);
       if (!isMatch) throw new UnauthorizedException();

       return user;
     }

     async login({ id, email }: { id: number; email: string }) {
       const payload = { sub: id, email };
       return {
         access_token: this.jwtService.sign(payload),
         expires_in: this.jwtService.decode(this.jwtService.sign(payload))['exp'],
       };
     }
   }
   ```

4. **Auth module** (`src/modules/auth/auth.module.ts`)
   ```typescript
   import { Module } from '@nestjs/common';
   import { JwtModule } from '@nestjs/jwt';
   import { PassportModule } from '@nestjs/passport';
   import { ConfigModule, ConfigService } from '@nestjs/config';
   import { AuthController } from './auth.controller';
   import { AuthService } from './auth.service';
   import { JwtStrategy } from './strategies/jwt.strategy';
   import { UsersModule } from '../../dal/dal.modules';

   @Module({
     imports: [
       ConfigModule,
       UsersModule,
       PassportModule,
       JwtModule.registerAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
           secret: config.get<string>('JWT_SECRET'),
           signOptions: {
             expiresIn: config.get<string>('JWT_EXPIRES_IN'),
           },
         }),
       }),
     ],
     controllers: [AuthController],
     providers: [AuthService, JwtStrategy],
     exports: [AuthService],
   })
   export class AuthModule {}
   ```

5. **Auth guard** (`src/modules/auth/guard/jwt-auth.guard.ts`)
   ```typescript
   import { ExecutionContext, Injectable } from '@nestjs/common';
   import { AuthGuard } from '@nestjs/passport';

   @Injectable()
   export class JwtAuthGuard extends AuthGuard('jwt') {
     canActivate(context: ExecutionContext) {
       return super.canActivate(context);
     }
   }
   ```

6. **Public routes** (optional decorator) (`src/app/decorator/is-public.decorator.ts` already exists)
   - Use `@IsPublic()` decorator on routes that bypass the guard.

7. **Apply globally** (in `main.ts`)
   ```typescript
   import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';

   app.useGlobalGuards(app.get(JwtAuthGuard));
   ```
   > Note: For complex setups, consider using `APP_GUARD` provider inside a module to avoid circular dependencies.

---

## 5. Setting Up Sequelize ORM

1. **Sequelize module registration** (`src/app/services/sequelize-config.service.ts`)
   ```typescript
   import { Injectable } from '@nestjs/common';
   import { ConfigService } from '@nestjs/config';
   import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
   import { User } from '../../dal/entities/user.entity';

   @Injectable()
   export class SequelizeConfigService implements SequelizeOptionsFactory {
     constructor(private readonly configService: ConfigService) {}

     createSequelizeOptions(): SequelizeModuleOptions {
       return {
         dialect: 'postgres',
         host: this.configService.get<string>('DB_HOST'),
         port: this.configService.get<number>('DB_PORT'),
         username: this.configService.get<string>('DB_USERNAME'),
         password: this.configService.get<string>('DB_PASSWORD'),
         database: this.configService.get<string>('DB_NAME'),
         models: [User],
         autoLoadModels: true,
         synchronize: false,
         logging: process.env.NODE_ENV !== 'production',
       };
     }
   }
   ```

2. **Register Sequelize module in `AppModule`**
   ```typescript
   import { SequelizeModule } from '@nestjs/sequelize';
   import { SequelizeConfigService } from './app/services/sequelize-congif.service';

   @Module({
     imports: [
       SequelizeModule.forRootAsync({
         useClass: SequelizeConfigService,
       }),
       // other feature modules
     ],
   })
   export class AppModule {}
   ```

3. **Define models** (`src/dal/entities/user.entity.ts`)
   ```typescript
   import { Column, DataType, Model, Table } from 'sequelize-typescript';

   @Table({ tableName: 'users' })
   export class User extends Model {
     @Column({
       type: DataType.INTEGER,
       primaryKey: true,
       autoIncrement: true,
     })
     id: number;

     @Column({ type: DataType.STRING, allowNull: false, unique: true })
     email: string;

     @Column({ type: DataType.STRING, allowNull: false })
     password: string;

     @Column({ type: DataType.STRING })
     fullName: string;
   }
   ```

4. **Data access service** (`src/dal/user.data.service.ts`)
   ```typescript
   import { Injectable } from '@nestjs/common';
   import { InjectModel } from '@nestjs/sequelize';
   import { User } from './entities/user.entity';

   @Injectable()
   export class UsersService {
     constructor(
       @InjectModel(User)
       private readonly userModel: typeof User,
     ) {}

     create(payload: Partial<User>) {
       return this.userModel.create(payload);
     }

     findByEmail(email: string) {
       return this.userModel.findOne({ where: { email } });
     }
   }
   ```

5. **Database migrations/seeders**
   - Use `sequelize-cli` (already configured via `migrations/` and `seeders/`).
   - Generate migration:
     ```cmd
     npx sequelize-cli migration:generate --name CreateUsersTable
     ```
   - Run migrations:
     ```cmd
     npx sequelize-cli db:migrate
     ```

6. **Testing database connection**
   - Add a health check endpoint or run an integration test to confirm that models load and queries succeed.

---

## 6. Structured Logging

1. **Custom logger implementation** (`src/app/logger/logger.ts`)
   ```typescript
   import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

   @Injectable()
   export class AppLogger extends ConsoleLogger {
     constructor(context = 'AppLogger') {
       super(context, { timestamp: true });
       const levels: LogLevel[] = process.env.NODE_ENV === 'production'
         ? ['error', 'warn']
         : ['log', 'error', 'warn', 'debug', 'verbose'];
       this.setLogLevels(levels);
     }

     log(message: string) {
       super.log(message);
     }

     error(message: string, stack?: string) {
       super.error(message, stack);
     }

     warn(message: string) {
       super.warn(message);
     }
   }
   ```

2. **Logger module** (`src/app/logger/logger.modules.ts`)
   ```typescript
   import { Global, Module } from '@nestjs/common';
   import { AppLogger } from './logger';

   @Global()
   @Module({
     providers: [AppLogger],
     exports: [AppLogger],
   })
   export class LoggerModule {}
   ```

3. **Use the logger globally**
   - In `main.ts`:
     ```typescript
     const appLogger = app.get(AppLogger);
     app.useLogger(appLogger);
     ```

4. **Logging in services and controllers**
   ```typescript
   import { Injectable } from '@nestjs/common';
   import { AppLogger } from '../app/logger/logger';

   @Injectable()
   export class BookingService {
     constructor(private readonly logger: AppLogger) {}

     async reserveSeat(dto: ReserveSeatDto) {
       this.logger.log(`Reserving seat for user ${dto.userId}`);
       // business logic
     }
   }
   ```

5. **Persisting logs (optional)**
   - Integrate a transport like Winston or Pino if you need JSON logs, file rotation, or log aggregation.
   - Example with Winston:
     ```cmd
     npm install nest-winston winston
     ```
     ```typescript
     import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
     import * as winston from 'winston';

     const app = await NestFactory.create(AppModule, {
       logger: WinstonModule.createLogger({
         transports: [
           new winston.transports.Console({
             format: winston.format.combine(
               winston.format.timestamp(),
               nestWinstonModuleUtilities.format.nestLike('MovieReservation', {
                 colors: true,
                 prettyPrint: true,
               }),
             ),
           }),
         ],
       }),
     });
     ```

---

## 7. Putting It Together in `AppModule`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from './app/logger/logger.modules';
import { SequelizeConfigService } from './app/services/sequelize-congif.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './dal/dal.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    LoggerModule,
    SequelizeModule.forRootAsync({ useClass: SequelizeConfigService }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

- `main.ts` is responsible for bootstrapping Swagger, enabling global guards, and attaching the logger instance.
- DTOs and controllers should use Swagger decorators to improve documentation quality.
- Guards and strategies handle JWT validation for protected endpoints.

---

## 8. Testing and Validation

1. **Unit tests**
   - Mock services: use `Test.createTestingModule` with `overrideProvider` for logger and JWT services.
   - Validate DTOs using `class-validator` + `class-transformer` (install if not already present).

2. **Integration tests**
   - Use `@nestjs/testing` to spin up application context.
   - Seed test database with migrations before running tests.

3. **Manual verification checklist**
   - Swagger UI accessible and showing bearer auth button.
   - User registration/login endpoints issue valid JWTs.
   - Protected endpoints reject requests without/with invalid tokens.
   - Sequelize models sync or migrate successfully.
   - Logger outputs include timestamps and respect environment log levels.

---

## 9. Helpful Resources

- **Swagger & NestJS**: https://docs.nestjs.com/openapi/introduction
- **JWT & Authentication**: https://docs.nestjs.com/security/authentication
- **Sequelize & NestJS**: https://docs.nestjs.com/techniques/database#sequelize-integration
- **Logger**: https://docs.nestjs.com/techniques/logger
- **Sequelize CLI**: https://sequelize.org/docs/v6/other-topics/migrations
- **Passport JWT**: http://www.passportjs.org/packages/passport-jwt/

These resources complement the configurations in this guide and provide deeper explanations and advanced patterns.
