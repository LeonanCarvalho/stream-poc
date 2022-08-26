module.exports = (N) => {
  return Array(N)
    .fill()
    .map((_, i) => {
      return {
        id: i + 1,
        date: new Date(),
        string: "Descrição",
        float: 1.44,
        object: {
          id: i + 1,
          data: new Date(),
          string: "Descrição",
          float: 1.44,
          nested: {
            foo: "foo",
          },
        },
        array: [0, 1, 2, 3],
      };
    });
};
