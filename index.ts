import { Benchmark, type MeasureOptions } from "kelonio";
import fs from "fs";
import { rm } from "fs/promises";
import path from "path";
import child_process from "child_process";
import util from "util";
import { colorized } from "./utils";
import chalk from "chalk";

const exec = util.promisify(child_process.exec);

const LOCAL_NEXT_PATH = "/Users/knickman/Developer/vercel/development/next.js";

async function cleanBuildDirectory(testCase: string) {
  const nextDirectory = path.join(process.cwd(), "cases", testCase, ".next");
  console.log(
    `${chalk.bold("Cleaning")}: ${chalk.dim("cases/")}${colorized(testCase)}`
  );
  if (fs.existsSync(nextDirectory)) {
    await rm(nextDirectory, { recursive: true, force: true });
  }
}

async function runBuild(testCase: string, enableTrace: boolean = false) {
  const cwd = path.join(process.cwd(), "cases", testCase);
  console.log(
    `${chalk.underline("Building")}: ${chalk.dim("cases/")}${colorized(
      testCase
    )}`
  );
  try {
    const { stderr } = await exec("pnpm build", {
      cwd,
      env: {
        ...process.env,
        NEXT_TURBOREPO_TRACE_FILE: enableTrace
          ? ".next/turbo-trace.json"
          : undefined,
      },
    });
    if (stderr) {
      console.error(stderr);
    }
  } catch (e) {
    console.error(e);
  }
}

async function setupLocalNextCases() {
  console.log("Setting up local next test cases...\n");
  const directories = fs.readdirSync("./cases");
  directories.forEach(async (directory) => {
    if (directory.endsWith("-trace")) {
      const caseDirectory = path.join(process.cwd(), "cases", directory);
      // link local next
      await exec(`./link-next.sh ${LOCAL_NEXT_PATH}`, { cwd: caseDirectory });
      // install to make sure it's picked up
      await exec("pnpm i", { cwd: caseDirectory });
    }
  });
}

async function test() {
  const opts: MeasureOptions = {
    iterations: 5,
    serial: true,
    verify: false,
  };

  // make sure the *-with-trace cases are setup properly

  const benchmark = new Benchmark();

  // link local next to test
  await setupLocalNextCases();

  // current next
  const asaCase = "approuter-single-app";
  const asa = benchmark.record(asaCase, async () => await runBuild(asaCase), {
    ...opts,
    beforeEach: () => cleanBuildDirectory(asaCase),
  });

  const psaCase = "pages-single-app";
  const psa = benchmark.record(psaCase, async () => await runBuild(psaCase), {
    ...opts,
    beforeEach: () => cleanBuildDirectory(psaCase),
  });
  // local test
  const asawtCase = "local-approuter-single-app-with-trace";
  const asawt = benchmark.record(
    asawtCase,
    async () => await runBuild(asawtCase, true),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(asawtCase),
    }
  );

  const asawotCase = "local-approuter-single-app-without-trace";
  const asawot = benchmark.record(
    asawotCase,
    async () => await runBuild(asawotCase, false),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(asawotCase),
    }
  );

  const psawtCase = "local-pages-single-app-with-trace";
  const psawt = benchmark.record(
    psawtCase,
    async () => await runBuild(psawtCase, true),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(psawtCase),
    }
  );

  const psawotCase = "local-pages-single-app-without-trace";
  const psawot = benchmark.record(
    psawotCase,
    async () => await runBuild(psawotCase, false),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(psawotCase),
    }
  );

  const lpsawtCase = "local-large-pages-single-app-with-trace";
  const lpsawt = benchmark.record(
    lpsawtCase,
    async () => await runBuild(lpsawtCase, true),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(lpsawtCase),
    }
  );

  const lpsawotCase = "local-large-pages-single-app-without-trace";
  const lpsawot = benchmark.record(
    lpsawotCase,
    async () => await runBuild(lpsawotCase, false),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(lpsawotCase),
    }
  );

  const xlpsawotCase = "local-xlarge-pages-single-app-with-trace";
  const xlpsawot = benchmark.record(
    xlpsawotCase,
    async () => await runBuild(xlpsawotCase, true),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(xlpsawotCase),
    }
  );

  const xlpsawtCase = "local-xlarge-pages-single-app-without-trace";
  const xlpsawt = benchmark.record(
    xlpsawtCase,
    async () => await runBuild(xlpsawtCase, false),
    {
      ...opts,
      beforeEach: () => cleanBuildDirectory(xlpsawtCase),
    }
  );

  await Promise.all([
    asa,
    psa,
    asawt,
    asawot,
    psawt,
    psawot,
    lpsawt,
    lpsawot,
    xlpsawt,
    xlpsawot,
  ]);

  console.log(benchmark.report());
}

test();
