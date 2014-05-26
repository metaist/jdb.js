define(function () {
  return {
    isMale: function (r) { return 'M' === r.gender; },
    records: function () { return [
      {id: 1, name: 'Harry Potter', gender: 'M', age: 15, student: true},
      {id: 2, name: 'Ron Weasley', gender: 'M', age: 14, student: true},
      {id: 3, name: 'Hermione Granger', gender: 'F', age: 15, student: true},
      {id: 4, name: 'Lord Voldemort', gender: 'M', age: 80, student: false},
      {id: 5, name: 'Albus Dumbledore', gender: 'M', age: 90, student: false},
      {id: 6, name: 'Minerva McGonagall', gender: 'F', age: 60, student: false}
    ]; }
  };
});
