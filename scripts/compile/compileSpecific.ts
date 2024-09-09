import { task } from "hardhat/config";

// Define a custom Hardhat task to compile a specific contract
task("compile:specific", "Compile a specific contract")
  .addParam("contract", "The name of the contract to compile (without .sol extension)")
  .setAction(async (taskArgs, hre) => {
    const contractPath = `./contracts/${taskArgs.contract}.sol`; // Construct the contract path

    console.log(`Compiling contract at path: ${contractPath}`);

    // Run the compile task with forced recompilation
    await hre.run("compile", {
      force: true,
      quiet: false,
    });

    console.log(`Successfully compiled contract: ${taskArgs.contract}`);
  });
