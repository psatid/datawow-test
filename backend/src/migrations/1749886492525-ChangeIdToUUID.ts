import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdToUUID1749886492525 implements MigrationInterface {
    name = 'ChangeIdToUUID1749886492525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concert" DROP CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f"`);
        await queryRunner.query(`ALTER TABLE "concert" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "concert" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "concert" ADD CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concert" DROP CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f"`);
        await queryRunner.query(`ALTER TABLE "concert" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "concert" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "concert" ADD CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f" PRIMARY KEY ("id")`);
    }

}
