# check-coins

Высоконагруженная оптимизированная таблица.  
  
Может содержать около 2000 записей.  
Записи подгружаются по скролу из стороннего API.  
Обновления данных приходят по нативным веб-сокетам.  
  
Данные о новом курсе валют могу приходить до 100 раз в секунду.  
Новые данные о курсе приходят в минуту примерно:
- Для bitcoin 70 раз.  
- Для ethereum 45 раз.  
- Суммарно для всех валют 5700 раз.  
    
Новые данные о сделках приходят в минуту примерно:
- Для bitcoin 2200 раз.  
- Для ethereum 900 раз.
- Суммарно для всех валют 12000 раз.  
  
В коде выполнен ряд оптимизаций,  
чтобы уменьшить нагрузку на CPU и RAM
учитывая актуальность вывода данных для пользователя.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
