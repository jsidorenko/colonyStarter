// An example using the setTaskEvaluatorRole operation
const signSetTaskEvaluatorRole = async (colonyClient, taskId) => {

  // Get JSON formatted operation from the mock database
  const operationJSON = DATABASE.operations.setTaskEvaluatorRole;

  // Check the operation
  if (operationJSON) {

    // Restore operation
    const operation = await colonyClient.setTaskEvaluatorRole.restoreOperation(
      operationJSON,
    );

    // Check if the operation matches the colony contract and task id and if
    // the current account is one of the required signees for the operation.
    if (
      operation.payload.sourceAddress === colonyClient.contract.address &&
      operation.payload.inputValues.taskId === taskId &&
      operation.missingSignees.includes(colonyClient.adapter.wallet.address.toLowerCase())
    ) {

      // Sign the operation
      await operation.sign();

      // Check for missing signees
      if (operation.missingSignees.length === 0) {

        // Send the operation
        await operation.send();

        // Update the operation in the mock database
        DATABASE.operations.setTaskEvaluatorRole = null;

      } else {

        // Check out the logs to see the operation missing signees
        console.log('Missing Signees:', operation.missingSignees);

        // Serialize operation into JSON format
        const operationJSON = operation.toJSON();

        // Store the operation in the mock database
        DATABASE.operations.setTaskEvaluatorRole = operationJSON;

      }

    } else {

      // Check out the logs to see the source of the pending operation
      console.log('Operation Source:', operation.payload.sourceAddress);

      // Check out the logs to see the task id of the pending operation
      console.log('Operation Task ID:', operation.payload.inputValues.taskId);

      // Check out the logs to see the required signees of the operation
      console.log('Missing Signees:', operation.missingSignees);

    }

  }

  // Get the task evaluator role
  const taskRole = await colonyClient.getTaskRole.call({
    taskId,
    role: 'EVALUATOR',
  });

  // Check out the logs to see the task evaluator role
  console.log('Task Role:', taskRole);

  // Return the task evaluator role
  return taskRole;

}

// Export signSetTaskEvaluatorRole example
module.exports = signSetTaskEvaluatorRole;
