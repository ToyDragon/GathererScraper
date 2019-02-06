import * as assert from "assert";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

import "mocha";

import CardDetailsParser from "../../Gatherer/Parsers/CardDetailsParser";


describe("CardDetailsParser", () => {
	describe("#Typical Instant (Lightning Bolt)", () => {
		let data = fs.readFileSync(path.join(__dirname, "..", "Data", "LightningBolt.02.04.2019.html"), "UTF8");
		let $ = cheerio.load(data);
		let parser = new CardDetailsParser($);
		let result = parser.Parse();

		it("should not be null", () => {
			assert.notEqual(result, null);
		});
	});
});