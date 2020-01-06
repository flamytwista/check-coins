import _memoize from 'lodash/memoize';

// squareMemoized(2) // вызовется
// squareMemoized(3) // вызовется
// squareMemoized(4) // вызовется
// squareMemoized(2) // вернет закешированный результат
// squareMemoized(2) // вернет закешированный результат
// squareMemoized(3) // вернет закешированный результат


// ////////////////////////////////
import _wrap from 'lodash/wrap'; // Вася is Cool guy, Musician

// //////////////////////
// import _property from 'lodash/property'
// let object = { 'a': { 'b': 2 } }
// let getAB = _property('a.b')
// let value = getAB(object)
// console.log(value); console.log('^...value:')

// /

// /
import _ from 'lodash';

const square = function (number) {
  return number * number;
};

const squareMemoized = _memoize(square);

const describeMan = function (name, description, description2 = '') {
  return `${name} is ${description}, ${description2}`;
};
const describeVasya = _wrap('Вася', describeMan);

describeVasya('Cool guy'); // Вася is Cool guy,
describeVasya('Cool guy', 'Musician');


function save(obj) {
  console.log('saving', obj.name);
}

const saveDebounced = _.wrap(
  _.memoize(
    () => _.debounce(save, 1000, {
      maxWait: 1000,
    }),
    _.property('id'),
  ),
  (func, obj) => func(obj)(obj),
);

// function sleep(ms) {ms += new Date().getTime();while (new Date() < ms){}}

// saveDebounced({ id: 1, name: 'Jim' });
// saveDebounced({ id: 2, name: 'Jane' });
// saveDebounced({ id: 1, name: 'James' });
const i = 0;
const { body } = document;
body.addEventListener('click', () => {
  console.log('======clicked');
  saveDebounced({ id: 1, name: `James ${i}` });
});
// setInterval(()=>{
//   i += 1
//   console.log(`here----------------------------------${i}`)
//   saveDebounced({ id: 1, name: `James ${i}` })
// }, 1000)
// for (let i = 0; i < 1000000000000; i++) {
// for (let i = 0; i < 100000; i++) {
//   saveDebounced({ id: 1, name: `James ${i}` });
// }
// sleep(3100);
// for (let i = 0; i < 100000; i++) {
//   saveDebounced({ id: 2, name: `Jane ${i}` });
// }
// sleep(3100);
// for (let i = 0; i < 100000; i++) {
//   saveDebounced({ id: 1, name: `Josh ${i}` });
// }

// ////////////////////////////////////////////////////////////

/**
 *
 * @param cacheKey. Нужно составлять например так:
 * 'id обьекта над которым работаем' + 'идентификатор конкретного действия'.
 * Иначе может получится что если над объектом с одним id делать 2 различных действия с помощью этой ф-и
 * то при запуск первого действия может не произойти, если вслед за ним следует второе(ДРУГОЕ) действие.
 * @param func
 * @returns {*}
 */
const debounceByKey = function (cacheKey, func) {
  // return _.debounce(func, 150)
  return func;
  // console.dir(func)
  // return func.bind(this, {id:3, name:'lars'})
  // return _.wrap()
};

const doSomethingWithObject = function (object) {
  console.log(object); console.log('^...object:');
};

const object1 = { id: 1, name: 'James' };
const object2 = { id: 2, name: 'Kirk' };


// doSomethingWithObject(object1)

const doSomethingWithObjectDebounced = debounceByKey(object1.id, doSomethingWithObject);
// let doSomethingWithObjectDebounced = debounceByKey(doSomethingWithObject)
// doSomethingWithObjectDebounced(object1.id, object1)
