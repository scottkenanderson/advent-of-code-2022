import { CommandType } from "./CommandType";

export class Command {
  type: CommandType;
  arg: string | null;

  constructor(type: string, arg: string | null = null) {
    this.type = type as CommandType;
    this.arg = arg;
  }
}
