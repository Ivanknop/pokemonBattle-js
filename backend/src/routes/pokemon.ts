import { Router, Request, Response } from "express";
import prisma from "../db";
import type { Prisma } from "@prisma/client";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 0;
    const offset = parseInt(req.query.offset as string) || 0;
    const orderBy: Prisma.PokemonOrderByWithRelationInput = { name: "asc" };
    const query: Prisma.PokemonFindManyArgs = { orderBy };
    if (limit > 0) {
      query.take = limit;
      if (offset > 0) query.skip = offset;
    }
    const pokemon = await prisma.pokemon.findMany(query);
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pokemon" });
  }
});

router.get("/random", async (_req: Request, res: Response) => {
  try {
    const count = await prisma.pokemon.count();
    const skip = Math.floor(Math.random() * count);
    const pokemon = await prisma.pokemon.findMany({ take: 1, skip });
    res.json(pokemon[0] || null);
  } catch (error) {
    res.status(500).json({ error: "Error fetching random pokemon" });
  }
});

router.get("/random-excluding", async (req: Request, res: Response) => {
  try {
    const exclude = req.query.name as string;
    const pokemon = await prisma.pokemon.findMany({
      where: { name: { not: exclude } },
    });
    const random = pokemon[Math.floor(Math.random() * pokemon.length)];
    res.json(random || null);
  } catch (error) {
    res.status(500).json({ error: "Error fetching random pokemon" });
  }
});

router.get("/:name", async (req: Request, res: Response) => {
  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { name: req.params.name },
    });
    if (!pokemon) {
      res.status(404).json({ error: "Pokemon not found" });
      return;
    }
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pokemon" });
  }
});

export default router;
