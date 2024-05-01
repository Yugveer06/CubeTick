const getMinSolveTimeId = (sessionSolves) =>
  sessionSolves.reduce((minSolve, solve) => {
    const solvePenaltyCheck =
      solve.penalty === "+2" ? 2000 : solve.penalty === "dnf" ? Infinity : 0;
    const minSolvePenaltyCheck =
      minSolve.penalty === "+2"
        ? 2000
        : minSolve.penalty === "dnf"
          ? Infinity
          : 0;

    return solve.solveTime + solvePenaltyCheck <
      minSolve.solveTime + minSolvePenaltyCheck
      ? solve
      : minSolve;
  }).id;

const getMinAverageId = (sessionSolves, averageSize) => {
  if (averageSize > sessionSolves.length) return null;
  return sessionSolves.reduce((minSolve, solve) =>
    (getAverageOfSolveTime(sessionSolves, solve.id, averageSize) || Infinity) <
    (getAverageOfSolveTime(sessionSolves, minSolve.id, averageSize) || Infinity)
      ? solve
      : minSolve,
  ).id;
};

const getAverageOfSolveTime = (sessionSolves, id, averageSize) => {
  const index = sessionSolves.findIndex((solve) => solve.id === id);

  if (index >= averageSize - 1) {
    return Math.floor(
      sessionSolves
        .slice(index - averageSize + 1, index + 1)
        .reduce(
          (acc, solve) =>
            acc +
            (solve.penalty === "+2"
              ? solve.solveTime + 2000
              : solve.penalty === "dnf"
                ? 0
                : solve.solveTime),
          0,
        ) / averageSize,
    );
  }

  return null;
};

export { getMinSolveTimeId, getMinAverageId, getAverageOfSolveTime };
