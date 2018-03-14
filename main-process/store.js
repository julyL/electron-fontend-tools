var store = {};
store.get = function(key) {
  var val = localStorage.getItem(key);
  try {
    val = JSON.parse(val);
  } catch (err) {}
  return val;
};
store.set = function(key, val) {
  try {
    var val = localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(err);
  }
};
module.exports = store;
