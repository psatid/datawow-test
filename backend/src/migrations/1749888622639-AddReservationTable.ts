import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReservationTable1749888622639 implements MigrationInterface {
    name = 'AddReservationTable1749888622639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservation_status_enum" AS ENUM('confirmed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerEmail" character varying NOT NULL, "status" "public"."reservation_status_enum" NOT NULL DEFAULT 'confirmed', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "concertId" uuid, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_695fee0a1da3b71b59f0c1e00b9"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_status_enum"`);
    }

}
