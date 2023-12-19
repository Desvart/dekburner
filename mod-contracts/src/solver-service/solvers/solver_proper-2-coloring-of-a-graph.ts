import { IProblemSolver } from "/mod-contracts/src/solver-service/ISolver";

export class Solver_proper2ColoringOfAGraph implements IProblemSolver {
  /* You are given the following data, representing a graph:
     [6,[[2,5],[3,5],[1,2],[3,4]]]
     Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or
     plotting. The first element of the data represents the number of vertices in the graph. Each vertex is a unique
     number between 0 and 5. The next element of the data represents the edges of the graph. Two vertices u,v in a
     graph are said to be adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u],
     as order does not matter. You must construct a 2-coloring of the graph, meaning that you have to assign each vertex
     in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color. Submit your answer
     in the form of an array, where element i represents the color of vertex i. If it is impossible to construct a
     2-coloring of the given graph, instead submit an empty array.
     Examples:

     Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
     Output: [0, 0, 1, 1]

     Input: [3, [[0, 1], [0, 2], [1, 2]]]
     Output: []
  */

  solve(input: [number, number[][]]): number[] {
    const numVertices = input[0];
    const graph = input[1];
    // Array to store colors assigned to each vertex
    // -1 means the vertex has not been colored yet
    const colors = new Array(numVertices).fill(-1);

    // DFS function to try to color a vertex
    function dfs(vertex: number, color: number): boolean {
      // If the vertex is already colored, check if the color matches
      if (colors[vertex] !== -1) {
        return colors[vertex] === color;
      }

      // Color the vertex
      colors[vertex] = color;

      // Check all adjacent vertices
      for (const [v1, v2] of graph) {
        if (v1 === vertex || v2 === vertex) {
          const adjacentVertex = v1 === vertex ? v2 : v1;
          if (!dfs(adjacentVertex, 1 - color)) {
            return false; // If adjacent vertex can't be colored correctly, return false
          }
        }
      }

      return true;
    }

    // Try to color each component of the graph
    for (let i = 0; i < numVertices; i++) {
      if (colors[i] === -1) {
        if (!dfs(i, 0)) {
          return []; // If a component is not bipartite, return an empty array
        }
      }
    }

    return colors;
  }
}