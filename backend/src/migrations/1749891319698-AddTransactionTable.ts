import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionTable1749891319698 implements MigrationInterface {
    name = 'AddTransactionTable1749891319698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('reservation_created', 'reservation_cancelled')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."transaction_type_enum" NOT NULL, "customerEmail" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "concertId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_196caffeb9cccd5c3f06a6e399d" FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_196caffeb9cccd5c3f06a6e399d"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    }

}
