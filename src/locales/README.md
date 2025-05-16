## naming convention

key 使用使用小写字母，单词之间使用下划线分隔。方便搜索
```json
{
  "hello_world": "Hello World"
}
```

使用时和 tailwindcss 一样不能对 key 进行插值，必须使用完整的路径，例如 `t("locales.hello_world")`，不能使用变量插值: ``t(`locales.${variable}`)``

tag 插值使用 camelCase 命名，方便在使用时作为对象的属性名 `t("locales.hello_world", { wrappedText: "World" })`
```json
{
  "hello_world": "Hello <wrappedText>World</wrappedText>"
}
```

common 里存放一些简短通用的 key，最好是只有一个单词或固定短语
```json
{
  "common": {
    "ok": "OK",
    "cancel": "Cancel",
  }
}
```