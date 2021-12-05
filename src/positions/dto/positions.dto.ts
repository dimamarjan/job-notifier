export class PositionsDto {
  readonly category: string;
  readonly level: string;
  readonly company: string;
  readonly description?: string;
  readonly japaneseRequired: boolean;
  emitMethod?: string;
}
