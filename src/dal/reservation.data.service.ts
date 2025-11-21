import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseDataService } from './base.data.service';
import { Reservation } from './entities/reservations.entity';
import { Transaction, Op } from 'sequelize';

@Injectable()
export class ReservationDataService extends BaseDataService {
  constructor(@InjectModel(Reservation) private readonly model: typeof Reservation) {
    super();
  }

  async runInTransaction<T>(handler: (transaction: Transaction) => Promise<T>) {
    const sequelize = this.model.sequelize;
    if (!sequelize) {
      throw new Error('Database connection not initialized');
    }
    return sequelize.transaction(handler);
  }

  async findExistingReservations(slotId: number, seatIds: number[], transaction?: Transaction) {
    if (!seatIds.length) {
      return [];
    }

    return this.model.findAll({
      where: {
        slot_id: slotId,
        seat_id: { [Op.in]: seatIds },
      },
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined,
    });
  }

  async createReservations(
    reservations: Array<{ user_id: number; slot_id: number; seat_id: number; reserved_at: Date }>,
    transaction: Transaction,
  ) {
    return this.model.bulkCreate(reservations, { transaction });
  }

  async findByUser(userId: number) {
    return this.model.findAll({ where: { user_id: userId } });
  }

  async findById(id: number) {
    return this.model.findOne({ where: { id } });
  }

  async findBySlot(slotId: number) {
    return this.model.findAll({ where: { slot_id: slotId } });
  }

  async deleteReservation(id: number, transaction?: Transaction) {
    return this.model.destroy({ where: { id }, transaction });
  }
}
