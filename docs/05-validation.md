# Проверки прототипа

Дата: 02.11.2026

53 проверок успешно.

Проверены статические страницы, спецификации и взаимодействия в JSDOM. Эмуляция DOM не проверяет рендеринг, переносы текста, фактический фокус native dialog, скринридер или размеры зон нажатия.

Отдельная проверка в браузере выполнена 02.11.2026: три основные страницы на 1440, 1024, 768, 390 и 360 px. Результаты и ограничения — в [07-browser-qa.md](07-browser-qa.md). Эта команда повторяет только автоматические DOM-проверки, а не браузерный проход.

```text
PASS 404.html: semantic/SEO/links
PASS catalog\index.html: semantic/SEO/links
PASS equipment\a-210\index.html: semantic/SEO/links
PASS equipment\a-310\index.html: semantic/SEO/links
PASS equipment\c-410\index.html: semantic/SEO/links
PASS equipment\c-420\index.html: semantic/SEO/links
PASS equipment\c-820\index.html: semantic/SEO/links
PASS equipment\ch-45\index.html: semantic/SEO/links
PASS equipment\m-45\index.html: semantic/SEO/links
PASS equipment\n-1610\index.html: semantic/SEO/links
PASS equipment\n-810\index.html: semantic/SEO/links
PASS equipment\r-410\index.html: semantic/SEO/links
PASS equipment\r-450\index.html: semantic/SEO/links
PASS equipment\r-520\index.html: semantic/SEO/links
PASS index.html: semantic/SEO/links
PASS privacy\index.html: semantic/SEO/links
PASS catalog and all 12 product specifications synchronized
  ratio 16.29:1
PASS contrast #17212B / #FFFFFF
  ratio 5.93:1
PASS contrast #596574 / #FFFFFF
  ratio 5.43:1
PASS contrast #596574 / #F3F5F7
  ratio 6.13:1
PASS contrast #FFFFFF / #2358D5
  ratio 8.23:1
PASS contrast #FFFFFF / #1946B1
  ratio 9.41:1
PASS contrast #B5C0D0 / #101B2B
  ratio 6.84:1
PASS contrast #AC2535 / #FFFFFF
  ratio 7.20:1
PASS contrast #204AB4 / #F3F6FF
  ratio 4.67:1
PASS contrast #6B7582 / #FFFFFF
PASS category URL -> 3 radios; no irrelevant resolution filter
PASS technical filtering AND category
PASS individual filter removal
PASS empty state
PASS reset search/category/filters/sort
PASS search normalizes long dash
PASS sorting changes actual DOM order
PASS camera-only filters; old radio filters removed
PASS multiple technical groups use AND
PASS catalog runtime has no unhandled errors
PASS product context inserted without manual entry
PASS empty form errors tied to fields
PASS reject invalid contact abc
PASS reject invalid contact 123
PASS reject invalid contact a@b
PASS reject invalid contact +7abcdef1234567890
PASS reject invalid contact test@@test.kz
PASS sending state tester@example.com
PASS honest demo completion tester@example.com
PASS sending state +7 (700) 000-00-00
PASS honest demo completion +7 (700) 000-00-00
PASS sending state 87000000000
PASS honest demo completion 87000000000
PASS gallery changes image and alt
PASS form runtime has no unhandled errors
PASS solution context
PASS mobile menu closes after navigation
```

## Проверка переносимости

Проверены все 16 HTML-файлов офлайн-версии: локальные переходы, якоря, src и gallery data-src существуют. Вставка каталога Tilda запущена в JSDOM с URL category=radio: 3 позиции, JSON берётся из встроенного массива, сетевой запрос не нужен, необработанных ошибок нет. Это не проверка Tilda-публикации или браузерного рендеринга.
