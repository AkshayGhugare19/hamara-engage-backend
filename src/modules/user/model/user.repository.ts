import { Op, WhereOptions } from "sequelize";
import { BaseRepository } from "../../../core/models/base.repository";
import User from "./user.model";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return (User as any).scope("withPassword").findOne({
      where: { email },
    });
  }

  /** All non-admin users */
  async findAllUsers(): Promise<User[]> {
    return this.findWhere({ role: "USER" } as WhereOptions);
  }

  /** Paginate non-admin users */
  async paginateUsers(page: number, limit: number) {
    return this.paginate(page, limit, { role: { [Op.ne]: "ADMIN" } } as WhereOptions);
  }
}

export default new UserRepository();
