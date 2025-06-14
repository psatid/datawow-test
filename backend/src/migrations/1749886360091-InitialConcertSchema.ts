import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialConcertSchema1749886360091 implements MigrationInterface {
    name = 'InitialConcertSchema1749886360091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concert" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "seats" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "concert"`);
    }

}
