![ion.rangeSlider](_tmp/logo-ion-range-slider.png)

> <a href="readme.md">English description</a> | Описание на русском

Удобный, гибкий и отзывчивый слайдер диапазонов

***

* Версия: 2.1.4
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/index.html">Страница проекта и демо</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/ion.rangeSlider-2.1.4.zip">Загрузить ZIP-архив</a>

## Описание
* Ion.RangeSlider — классный, удобный, отзывчивый и легко настраиваемый слайдер диапазонов
* Слайдер поддерживает события и публичные методы, имеет гибкие настройки, может быть полностью видоизменен через CSS
* Кроссбраузерная поддержка: Google Chrome, Mozilla Firefox 3.6+, Opera 12+, Safari 5+, Internet Explorer 8+
* Плагин поддерживает устройства с touch-экраном (iPhone, iPad, Nexus, etc.)
* <a href="https://github.com/IonDen/ion.rangeSlider">Репозиторий на GitHub</a>
* Плагин свободно распространяется на условиях <a href="http://ionden.com/a/plugins/licence.html" target="_blank">лицензии MIT</a>
* Используюя этот плагин, вы сможете создавать крутейшие слайдеры диапазонов, такие как этот:

![ion.rangeSlider](http://ionden.com/a/plugins/ion.rangeSlider/static/img/ion-range-slider.png)

## Ключевые особенности
* Поддержка скинов. (5 скина в комплекте и PSD для изготовления собственных)
* Неограниченное кол-во слайдеров на одной странице без существенных потерь производительности и конфликтов между ними
* Два режима работы с 1 или 2 ползунками
* Поддержка отрицательных и дробных значений
* Возможность редактировать шаг и привязывать сетку к шагу
* Можно использовать собственный массив значений для слайдера
* Настраиваемая сетка значений
* Отключаемые элементы интерфейса (мин. и макс. значение, текущие значение, сетка)
* Постфиксы и префиксы для указания единиц измерения ($20, 20 &euro; и т.п.)
* Дополнительный постфикс для максимального значения (например $0 — $100<b>+</b>)
* Воможнось улучшить читабельность больших цифр (например 10000000 -> 10 000 000 или 10.000.000)
* Слайдер пишет свое значение прямо в value исходного поля input, что позволяет вставить сладер прямо внутрь любой формы
* Любой параметр слайдера можно так же задать через data-атрибут (например data-min="10")
* Слайдер поддерживает параметр disabled, позволяет делать слайдер неактивным
* Слайдер поддерживает внешние методы (update, reset и remove), позволяющие управлять слайдером уже после создания
* Для продвинутых пользователей есть поддержка колбэков (onStart, onChange, onFinish, onUpdate). Слайдер передает свои значения в эти функции первым аргументом в виде объекта
* Слайдер поддерживает работу с датой и временем


## Демо

* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo.html" class="switch__item">Базовые настройки</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_advanced.html" class="switch__item">Расширенные настройки</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_interactions.html" class="switch__item">Взаимодействия</a>


## Зависимости

* <a href="http://jquery.com/" target="_blank">jQuery 1.8.x+</a>


## Использование

Подключаем библиотеки:
* jQuery
* ion.rangeSlider.min.js

Подключаем стили:
* <a href="http://necolas.github.io/normalize.css/" target="_blank">normalize.css</a> (желательно, если он у вас еще не подключен)
* ion.rangeSlider.css

Не забываем про скин. 5 скинов включены в архив. Выберите один:
* ion.rangeSlider.skinFlat.css + sprite-skin-flat.png
* ion.rangeSlider.skinHTML5.css + без картинок
* ion.rangeSlider.skinModern.css + sprite-skin-modern.png
* ion.rangeSlider.skinNice.css + sprite-skin-nice.png
* ion.rangeSlider.skinSimple.css + sprite-skin-simple.png
                            
Либо воспользуйтесь вложенным в архив PSD файлом, и нарисуйте собственный скин (не забудьте модифицировать размеры элементов в CSS файле)


## Устанавливаем с помощью bower

* bower install ionrangeslider


## Устанавливаем с помощью npm

* npm install ion-rangeslider


## Инициализация

Создаем базовое поле <code>input type="text"</code>:
```html
<input type="text" id="example_id" name="example_name" value="" />
```

Чтобы запустить слайдер, вызовите ionRangeSlider для нужного элемента:
```javascript
$("#example_id").ionRangeSlider();
```

## Демо для новичков
Если вы новичок в веб разработке и не уверены как правильно подключить этот плагин на вашу страницу, то скачайте вот
<a href="http://ionden.com/a/plugins/ion.rangeSlider/ionRangeSliderDemo.zip" class="button">этот демо пример</a>


## Миграция с версии 1.x на 2.x
* Все параметры (кроме функций) теперь записываются так: <b>param_name</b>, а не paramName
* Изменились названия некоторых параметров: hasGrid &rarr; <b>grid</b>, onLoad &rarr; <b>onStart</b>
* Изменился формат объекта с данными слайдера, возвращаемый в колбэки. Например: fromNumber &rarr; <b>from</b>
* Слайдер теперь постоянно записывает свои значения в поле value и в атрибуты data-from и data-to


## <a href="http://jsfiddle.net/IonDen/qv6yrjrv/" target="_blank">Площадка для эксперементов с плагином</a>


## Настройка

<table class="options">
    <thead>
        <tr>
            <th>Атрибут</th>
            <th>По умолчанию</th>
            <th>Тип</th>
            <th>Описание</th>
        </tr>
    </thead>
    <tbody>
        <tr class="options__step">
            <td>type<div><sup>data-type</sup></div></td>
            <td>"single"</td>
            <td>string</td>
            <td>Позволяет выбрать тип слайдера, может принимать значение <code>single</code> - для одиночного слайдера или <code>double</code> - для двойного слайдера</td>
        </tr>

        <tr>
            <td>min<div><sup>data-min</sup></div></td>
            <td>10</td>
            <td>number</td>
            <td>Обозначает минимальное возможное значение слайдера.</td>
        </tr>
        <tr>
            <td>max<div><sup>data-max</sup></div></td>
            <td>100</td>
            <td>number</td>
            <td>Обозначает максимальное возможное значение слайдера.</td>
        </tr>
        <tr>
            <td>from<div><sup>data-from</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Позволяет задать стартовую позицию левого ползунка (или единственного ползунка)</td>
        </tr>
        <tr>
            <td>to<div><sup>data-to</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Позволяет задать стартовую позицию правого ползунка</td>
        </tr>
        <tr class="options__step">
            <td>step<div><sup>data-step</sup></div></td>
            <td>1</td>
            <td>number</td>
            <td>Задает шаг движения ползунков. Всегда больше нуля. Может быть дробным.</td>
        </tr>

        <tr>
            <td>min_interval<div><sup>data-min-interval</sup></div></td>
            <td>—</td>
            <td>number</td>
            <td>Задает минимальный диапазон между ползунками. Только для типа "double"</td>
        </tr>
        <tr class="options__step">
            <td>max_interval<div><sup>data-max-interval</sup></div></td>
            <td>—</td>
            <td>number</td>
            <td>Задает максимальный диапазон между ползунками. Только для типа "double"</td>
        </tr>
        <tr class="options__step">
            <td>drag_interval<div><sup>data-drag-interval</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Разрешает пользователю перетаскивать весь диапазон. Только для типа "double" (beta)</td>
        </tr>

        <tr class="options__step">
            <td>values<div><sup>data-values</sup></div></td>
            <td>[]</td>
            <td>array</td>
            <td>Переопределяет значения слайдера, значениями взятыми из массива values. Параметры min, max, step переопределяются автоматически.</td>
        </tr>

        <tr class="options__new">
            <td>from_fixed<div><sup>data-from-fixed</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Фиксирует позицию левого ползунка (или единственного ползунка).</td>
        </tr>
        <tr class="options__new">
            <td>from_min<div><sup>data-from-min</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Ограничивает минимальную позицию левого ползунка.</td>
        </tr>
        <tr class="options__new">
            <td>from_max<div><sup>data-from-max</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Ограничивает максимальную позицию левого ползунка.</td>
        </tr>
        <tr class="options__new">
            <td>from_shadow<div><sup>data-from-shadow</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Подсвечивает ограничения наложенные на левый ползунок.</td>
        </tr>

        <tr class="options__new">
            <td>to_fixed<div><sup>data-to-fixed</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Фиксирует позицию правого ползунка.</td>
        </tr>
        <tr class="options__new">
            <td>to_min<div><sup>data-to-min</sup></div></td>
            <td>min</td>
            <td>number</td>
            <td>Ограничивает минимальную позицию правого ползунка.</td>
        </tr>
        <tr class="options__new">
            <td>to_max<div><sup>data-to-max</sup></div></td>
            <td>max</td>
            <td>number</td>
            <td>Ограничивает максимальную позицию правого ползунка.</td>
        </tr>
        <tr class="options__new options__step">
            <td>to_shadow<div><sup>data-to-shadow</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Подсвечивает ограничения наложенные на правый ползунок.</td>
        </tr>

        <tr>
            <td>prettify_enabled<div><sup>data-prettify-enabled</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Улучшает внешний вид длинных цифр. 10000000 &rarr; 10 000 000</td>
        </tr>
        <tr class="options__new">
            <td>prettify_separator<div><sup>data-prettify-separator</sup></div></td>
            <td>" "</td>
            <td>string</td>
            <td>Позволяет выбирать разделитель для улучшения читаемости длинных цифр. 10 000, 10.000, 10-000 и т.п.</td>
        </tr>
        <tr class="options__new options__step">
            <td>prettify<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Собственная функция для постобработки значений слайдера. Позволяет делать с цифрами всё что угодно, например приобразовывать в даты и время.</td>
        </tr>

        <tr class="options__new options__step">
            <td>force_edges<div><sup>data-force-edges</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Заставляет слайдер всегда оставаться внутри границ своего контейнера.</td>
        </tr>

        <tr class="options__new">
            <td>keyboard<div><sup>data-keyboard</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Активирует управление слайдером с помощью клавиатуры. Влево: &larr, &darr, A, S. Вправо: &rarr, &uarr, W, D.</td>
        </tr>
        <tr class="options__new options__step">
            <td>keyboard_step<div><sup>data-keyboard-step</sup></div></td>
            <td>5</td>
            <td>number</td>
            <td>Шаг движения ползунка при управлении с клавиатуры. Задается в процентах.</td>
        </tr>

        <tr>
            <td>grid<div><sup>data-grid</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Включает отображение сетки значений.</td>
        </tr>
        <tr>
            <td>grid_margin<div><sup>data-grid-margin</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Выравнивает сетку по крайним позициям ползунков, либо по границам контейнера.</td>
        </tr>
        <tr class="options__new">
            <td>grid_num<div><sup>data-grid-num</sup></div></td>
            <td>4</td>
            <td>number</td>
            <td>Количество ячеек в сетке.</td>
        </tr>
        <tr class="options__new options__step">
            <td>grid_snap<div><sup>data-grid-snap</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Привязка сетки к шагу слайдера (параметр step). Если активирован, то параметр grid_num не учитывается.</td>
        </tr>

        <tr>
            <td>hide_min_max<div><sup>data-hide-min-max</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Прячет лейблы "min" и "max"</td>
        </tr>
        <tr class="options__step">
            <td>hide_from_to<div><sup>data-hide-from-to</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Прячет лейблы "from" и "to"</td>
        </tr>

        <tr>
            <td>prefix<div><sup>data-prefix</sup></div></td>
            <td>—</td>
            <td>string</td>
            <td>Отобразить префикс для значений слайдера. Будет отображен перед цифрой, например $100.</td>
        </tr>
        <tr>
            <td>postfix<div><sup>data-postfix</sup></div></td>
            <td>—</td>
            <td>string</td>
            <td>Отобразить постфикс для значений слайдера. Будет отображен после цифры, например 100 руб.</td>
        </tr>
        <tr>
            <td>max_postfix<div><sup>data-max-postfix</sup></div></td>
            <td>—</td>
            <td>string</td>
            <td>Отобразить дополнительный постфикс для максимального значения слайдера. Будет отображен если один из ползунков достигнет крайнего правого значения. Например 0 — 100+</td>
        </tr>
        <tr class="options__new">
            <td>decorate_both<div><sup>data-decorate-both</sup></div></td>
            <td>true</td>
            <td>boolean</td>
            <td>Используется для типа "double", в случае если задан prefix и/или postfix. Определяет, как декорировать близко расположенные значения.<br/>Например: $10k — $100k или же $10 — 100k</td>
        </tr>
        <tr class="options__new options__step">
            <td>values_separator<div><sup>data-values-separator</sup></div></td>
            <td>" — "</td>
            <td>string</td>
            <td>Разделитель для близко расположенных значений. Используется для типа "double". Например: 10 — 100, 10 to 100, 10 + 100, 10 &rarr; 100 и т.д.</td>
        </tr>
        
        <tr class="options__step">
            <td>input_values_separator<div><sup>data-input-values-separator</sup></div></td>
            <td>" ; "</td>
            <td>string</td>
            <td>Разделитель для двойных значений в поле value у базового input-элемента</td>
        </tr>

        <tr class="options__step">
            <td>disable<div><sup>data-disable</sup></div></td>
            <td>false</td>
            <td>boolean</td>
            <td>Блокирует слайдер, делает его не активным.</td>
        </tr>

        <tr>
            <td>onStart<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Коллбэк. Вызывается при старте слайдера.</td>
        </tr>
        <tr>
            <td>onChange<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Коллбэк. Вызывается каждый раз когда обновляются значения слайдера.</td>
        </tr>
        <tr>
            <td>onFinish<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Коллбэк. Вызывается когда пользователь заканчивает перемещать ползунок.</td>
        </tr>
        <tr class="options__new">
            <td>onUpdate<div><sup>—</sup></div></td>
            <td>null</td>
            <td>function</td>
            <td>Коллбэк. Вызывается когда слайдер обновляется методом <code>update</code> или <code>reset</code>.</td>
        </tr>
    </tbody>
</table>


## Описание данных передаваемых в колбэки (onChange и т.д):

Результат имеет тип object и передается коллбэк первым аргументом:
```javascript
Obj: {
    "input": object,    // jQuery-ссылка на input
    "slider": object,   // jQuery-ссылка на контейнер слайдера
    "min": 0,           // значение MIN
    "max": 1000,        // значение MAX
    "from": 100,        // значение ОТ (значение левого или единственного ползунка)
    "from_percent": 10, // значение ОТ в процентах
    "from_value": 0,    // индекс ОТ массива values (если используется)
    "to": 900,          // значение ДО (значение правого ползунка)
    "to_percent": 90,   // значение ДО в процентах
    "to_value": 0       // индекс ДО массива values (если используется)
}
```

## Создание слайдера c параметрами

Пример
```javascript
$("#example").ionRangeSlider({
    min: 0,
    max: 10000,
    from: 1000,
    to: 9000,
    type: 'double',
    prefix: "$",
    grid: true,
    grid_num: 10
});
```

Слайдер с параметрами можно также инициализировать используя атрибуты <code>data-*</code> у тэга <code>input</code>:
```html
data-min="0"
data-max="10000"
data-from="1000"
data-to="9000"
data-type="double"
data-prefix="$"
data-grid="true"
data-grid-num="10"
```

## Публичные методы

Для того чтобы использовать публичные методы, вначале нужно записать значение слайдера в переменную::
```javascript
// Запускаем слайдер
$("#range").ionRangeSlider({
    type: "double",
    min: 0,
    max: 1000,
    from: 200,
    to: 500,
    grid: true
});

// Записываем инстанс в переменную
var slider = $("#range").data("ionRangeSlider");

// Запускаем публичный метод
slider.reset();
```

Всего существует 3 публичных метода:
```javascript
// UPDATE - обновляет значения слайдера (можно менять любые значения)
slider.update({
    from: 300,
    to: 400
});

// RESET - сбрасывает слайдер к исходным значениям
slider.reset();

// DESTROY - убивает слайдер и восстанавливает исходный input
slider.destroy();
```

## Еще раз взглянем на демо

* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo.html" class="switch__item">Базовые настройки</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_advanced.html" class="switch__item">Расширенные настройки</a>
* <a href="http://ionden.com/a/plugins/ion.rangeSlider/demo_interactions.html" class="switch__item">Взаимодействия</a>

В демках есть примеры использования всех опций слайдера


### <a href="history.md">История обновлений</a>

***

#### Поддержите разработку плагинов серии Ion:

* Пожертвовать через сервис Pledgie: [![](https://pledgie.com/campaigns/25694.png?skin_name=chrome)](https://pledgie.com/campaigns/25694)

* Пожертвовать напрямую через Paypal: https://www.paypal.me/IonDen

* Пожертвовать напрямую через Яндекс.Деньги: http://yasobe.ru/na/razrabotku
