export function catchDuplicates(array) {
  var hash = {};
  const filteredArray = array.filter(function (current) {
    var exists = !hash[current.id];
    hash[current.id] = true;
    return exists;
  });
  console.log(filteredArray);
  return filteredArray;
}
