# APIリスト

## 使用可能なHTTPリクエスト

### `POST /get-money`
ユーザー名からそのユーザーの所持金を取得

#### 送信するデータ
Content-Type: `application/json`
```json
{"name":"<String>"}
```

#### 返り値
> :heavy_check_mark: **成功時**
> `200 OK`
> ```json
> {"name":"<String>","money":"<Number>"}
> ```

> :x: **失敗時**
> `400 Bad Request`

---

### `POST /add-money`
ユーザー名を指定し、指定した金額を増減させる
MySQLサーバーにきちんと反映される

#### 送信するデータ
Content-Type: `application/json`
```json
{"name":"<String>","value":"<Number>"}
```

#### 返り値
> :heavy_check_mark: **成功時**
> `200 OK`

> :x: **失敗時**
> `400 Bad Request`

---

### `POST /set-money`
ユーザー名を指定し、指定した金額に設定する
MySQLサーバーにきちんと反映される

#### 送信するデータ
Content-Type: `application/json`
```json
{"name":"<String>","value":"<Number>"}
```

#### 返り値
> :heavy_check_mark: **成功時**
> `200 OK`

> :x: **失敗時**
> `400 Bad Request`

---

### `POST /signup`
ユーザーのサインアップを行う

#### 送信するデータ
Content-Type: `application/json`
```json
{"email":"<String>","name":"<String>","password":"<String>"}
```

#### 返り値
> :heavy_check_mark: **成功時**
> `200 OK`

> :x: **失敗時**
> `400 Bad Request - This email address is already registered.`
> `400 Bad Request - This name is already registered.`

---

### `POST /signin`
ユーザーのサインインを行う

#### 送信するデータ
Content-Type: `application/json`
```json
{"email":"<String>","password":"<String>"}
```

#### 返り値
> :heavy_check_mark: **成功時**
> `200 OK`
> ```text
> <USERNAME>
> ```

> :x: **失敗時**
> `400 Bad Request - This email address is NOT available.`
> `400 Bad Request - Wrong password.`
