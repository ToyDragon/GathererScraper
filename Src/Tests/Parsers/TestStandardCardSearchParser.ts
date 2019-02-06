import * as assert from "assert";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

import "mocha";

import StandardCardSearchParser from "../../Gatherer/Parsers/StandardCardSearchParser";
import { MTGCardRarity } from "../../Types/MTGCardRarity";


describe("StandardCardSearchParser", () => {
    describe("#Aether Revolt Page 0", () => {
        let data = fs.readFileSync(path.join(__dirname, "..", "Data", "AetherRevoltSetPage0.02.04.2019.html"), "UTF8");
        let $ = cheerio.load(data);
        let parser = new StandardCardSearchParser("Aether Revolt", $);
        let result = parser.Parse();

        it("should not be null", () => {
            assert.notEqual(result, null);
        });

        it("found the set code", () => {
            assert.equal(result.code, "AER");
        });

        it("found the set name", () => {
            assert.equal(result.name, "Aether Revolt");
        });

        it("has found cards exist", () => {
            assert.notEqual(result.cards, null);
        });

        it("found the right number of cards", () => {
            assert.equal(result.cards && result.cards.length, 100); 
        });
    });

    describe("#Aether Revolt Card 0", () => {
        let data = fs.readFileSync(path.join(__dirname, "..", "Data", "AetherRevoltSetPage0.02.04.2019.html"), "UTF8");
        let $ = cheerio.load(data);
        let parser = new StandardCardSearchParser("Aether Revolt", $);
        let result = parser.Parse();
        let index = 0;

        it("should not be null", () => {
            assert.notEqual(result.cards[index], null);
        });

        it("found Aegis Automaton's name", () => {
            assert.equal(result.cards[index].name, "Aegis Automaton");
        });

        it("found Aegis Automaton's id", () => {
            assert.equal(result.cards[index].multiverseId, 423808);
        });

        it("found Aegis Automaton's cost", () => {
            assert.equal(result.cards[index].cost["C"], 2);
        });

        it("found Aegis Automaton's text", () => {
            assert.equal(result.cards[index].text, "{4}{W}: Return another target creature you control to its owner's hand.");
        });

        it("found Aegis Automaton's super types", () => {
            assert.equal(result.cards[index].superTypes, undefined);
        });

        it("found Aegis Automaton's types", () => {
            assert.equal(result.cards[index].types[0], "Artifact");
            assert.equal(result.cards[index].types[1], "Creature");
        });

        it("found Aegis Automaton's sub types", () => {
            assert.equal(result.cards[index].subTypes[0], "Construct");
        });

        it("found Aegis Automaton's rarity", () => {
            assert.equal(result.cards[index].rarity, MTGCardRarity.Common);
        });

        it("found Aegis Automaton's power", () => {
            assert.equal(result.cards[index].power, 0);
        });

        it("found Aegis Automaton's toughness", () => {
            assert.equal(result.cards[index].toughness, 3);
        });
    });

    describe("#Aether Revolt Card 1", () => {
        let data = fs.readFileSync(path.join(__dirname, "..", "Data", "AetherRevoltSetPage0.02.04.2019.html"), "UTF8");
        let $ = cheerio.load(data);
        let parser = new StandardCardSearchParser("Aether Revolt", $);
        let result = parser.Parse();
        let index = 1;

        it("should not be null", () => {
            assert.notEqual(result.cards[index], null);
        });

        it("found Aerial Modification's name", () => {
            assert.equal(result.cards[index].name, "Aerial Modification");
        });

        it("found Aerial Modification's id", () => {
            assert.equal(result.cards[index].multiverseId, 423668);
        });

        it("found Aerial Modification's cost", () => {
            assert.equal(result.cards[index].cost["C"], 4);
            assert.equal(result.cards[index].cost["W"], 1);
        });

        it("found Aerial Modification's text", () => {
            assert.equal(result.cards[index].text, "Enchant creature or Vehicle\nAs long as enchanted permanent is a Vehicle, it's a creature in addition to its other types.\nEnchanted creature gets +2/+2 and has flying.");
        });

        it("found Aerial Modification's super types", () => {
            assert.equal(result.cards[index].superTypes, undefined);
        });

        it("found Aerial Modification's types", () => {
            assert.equal(result.cards[index].types[0], "Enchantment");
        });

        it("found Aerial Modification's sub types", () => {
            assert.equal(result.cards[index].subTypes[0], "Aura");
        });

        it("found Aerial Modification's rarity", () => {
            assert.equal(result.cards[index].rarity, MTGCardRarity.Uncommon);
        });
    });

    describe("#Aether Revolt Card 15", () => {
        let data = fs.readFileSync(path.join(__dirname, "..", "Data", "AetherRevoltSetPage0.02.04.2019.html"), "UTF8");
        let $ = cheerio.load(data);
        let parser = new StandardCardSearchParser("Aether Revolt", $);
        let result = parser.Parse();
        let index = 15;

        it("should not be null", () => {
            assert.notEqual(result.cards[index], null);
        });

        it("found Ajani Unyielding's name", () => {
            assert.equal(result.cards[index].name, "Ajani Unyielding");
        });

        it("found Ajani Unyielding's id", () => {
            assert.equal(result.cards[index].multiverseId, 423794);
        });

        it("found Ajani Unyielding's cost", () => {
            assert.equal(result.cards[index].cost["C"], 4);
            assert.equal(result.cards[index].cost["G"], 1);
            assert.equal(result.cards[index].cost["W"], 1);
        });

        it("found Ajani Unyielding's loyalty", () => {
            assert.equal(result.cards[index].loyalty, 4);
        });

        it("found Ajani Unyielding's text", () => {
            assert.equal(result.cards[index].text, "+2: Reveal the top three cards of your library. Put all nonland permanent cards revealed this way into your hand and the rest on the bottom of your library in any order.\n−2: Exile target creature. Its controller gains life equal to its power.\n−9: Put five +1/+1 counters on each creature you control and five loyalty counters on each other planeswalker you control.");
        });

        it("found Ajani Unyielding's super types", () => {
            assert.equal(result.cards[index].superTypes[0], "Legendary");
        });

        it("found Ajani Unyielding's types", () => {
            assert.equal(result.cards[index].types[0], "Planeswalker");
        });

        it("found Ajani Unyielding's sub types", () => {
            assert.equal(result.cards[index].subTypes[0], "Ajani");
        });

        it("found Ajani Unyielding's rarity", () => {
            assert.equal(result.cards[index].rarity, MTGCardRarity.MythicRare);
        });
    });
});