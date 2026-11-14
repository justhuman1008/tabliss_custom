# Tabliss Custom 2.6.1

Joel Shepherd의 [Tabliss 원본 `main` (`765a3f0`)](https://github.com/joelshepherd/tabliss/commit/765a3f0)을 바탕으로 수정한 버전입니다. 이 문서가 설명하는 수정판의 기준일은 **2026-11-14**입니다.

## 주요 변경 사항

- 설정과 위젯의 한국어 번역을 보완하고 다른 언어 번역을 제거했습니다.
- 빠른 링크의 아이콘 이미지를 외부 링크에서 불러 올 수 있게 변경했습니다.
- 검색창의 기본 문구를 바꿀 수 있게 했습니다.
- 이미지 링크 배경을 추가했습니다. 이미지 링크를 입력 하면 해당 이미지를 배경으로 사용 합니다.
- 배경을 변경했다가 다시 돌아와도 마지막에 사용한 이미지 정보를 그대로 사용합나다.
- Unsplash와 GIPHY에 개인 API 키를 입력할 수 있습니다.
- 날씨 위젯에서 한국 기상청을 선택할 수 있고, 공공데이터 API를 활용하여 한국에 맞는 지역 검색과 날씨, 온습도, 미세먼지 수치를 지원합니다.
- 원본 프로젝트로 오류를 보내는 Sentry 연동을 제거했습니다. 오류가 난 위젯의 안내는 새 탭에 표시됩니다.

[2.6.1 변경 기록](CHANGELOG.md)

## 변경된 파일

원본 커밋 `765a3f0`과 Tabliss Custom 2.6.1 소스를 비교했습니다.

<details>
<summary>추가 16개</summary>

| 파일 경로 |
| --- |
| `Original_README.md` |
| `src/hooks/useLocalCredential.ts` |
| `src/plugins/backgrounds/BackgroundApiKey.tsx` |
| `src/plugins/backgrounds/apiResponse.ts` |
| `src/plugins/backgrounds/imageLink/index.tsx` |
| `src/plugins/widgets/todo/TodoDescription.tsx` |
| `src/plugins/widgets/todo/TodoShortcutControl.tsx` |
| `src/plugins/widgets/weather/AirQualityDetails.tsx` |
| `src/plugins/widgets/weather/PublicDataKeySettings.tsx` |
| `src/plugins/widgets/weather/useAirQuality.ts` |
| `src/plugins/widgets/weather/weatherOptions.tsx` |
| `src/remoteImageUrl.ts` |
| `src/views/shared/icons/useFeatherIcons.ts` |
| `target/chromium/_locales/en/messages.json` |
| `target/chromium/_locales/ko/messages.json` |
| `target/shared/kma-forecast-locations.json` |

</details>

<details>
<summary>변경 98개</summary>

| 파일 경로 |
| --- |
| `.github/workflows/push.yml` |
| `CHANGELOG.md` |
| `README.md` |
| `package-lock.json` |
| `package.json` |
| `scripts/translations.js` |
| `src/contexts/error.tsx` |
| `src/contexts/time.tsx` |
| `src/db/action.ts` |
| `src/db/state.ts` |
| `src/global.d.ts` |
| `src/hooks/useApi.ts` |
| `src/hooks/useCache.ts` |
| `src/hooks/useTime.ts` |
| `src/lib/db/storage.ts` |
| `src/locales/IntlProvider.tsx` |
| `src/locales/lang/ko.json` |
| `src/locales/locales.ts` |
| `src/main.tsx` |
| `src/plugins/backgrounds/colour/ColourSettings.tsx` |
| `src/plugins/backgrounds/giphy/Credit.tsx` |
| `src/plugins/backgrounds/giphy/Giphy.tsx` |
| `src/plugins/backgrounds/giphy/GiphySettings.tsx` |
| `src/plugins/backgrounds/giphy/api.ts` |
| `src/plugins/backgrounds/gradient/GradientSettings.tsx` |
| `src/plugins/backgrounds/image/Image.tsx` |
| `src/plugins/backgrounds/image/ImageSettings.tsx` |
| `src/plugins/backgrounds/index.ts` |
| `src/plugins/backgrounds/unsplash/Unsplash.tsx` |
| `src/plugins/backgrounds/unsplash/UnsplashCredit.tsx` |
| `src/plugins/backgrounds/unsplash/UnsplashSettings.tsx` |
| `src/plugins/backgrounds/unsplash/api.ts` |
| `src/plugins/backgrounds/unsplash/types.ts` |
| `src/plugins/types.ts` |
| `src/plugins/widgets/css/CssSettings.tsx` |
| `src/plugins/widgets/github/GitHubSettings.tsx` |
| `src/plugins/widgets/greeting/Greeting.tsx` |
| `src/plugins/widgets/greeting/GreetingSettings.tsx` |
| `src/plugins/widgets/index.ts` |
| `src/plugins/widgets/ipInfo/IpInfo.tsx` |
| `src/plugins/widgets/ipInfo/IpInfoSettings.tsx` |
| `src/plugins/widgets/ipInfo/api.ts` |
| `src/plugins/widgets/ipInfo/types.ts` |
| `src/plugins/widgets/joke/Joke.sass` |
| `src/plugins/widgets/joke/Joke.tsx` |
| `src/plugins/widgets/joke/JokeSettings.tsx` |
| `src/plugins/widgets/joke/api.ts` |
| `src/plugins/widgets/joke/types.ts` |
| `src/plugins/widgets/links/Display.tsx` |
| `src/plugins/widgets/links/Input.tsx` |
| `src/plugins/widgets/links/Links.sass` |
| `src/plugins/widgets/links/Links.tsx` |
| `src/plugins/widgets/links/LinksSettings.tsx` |
| `src/plugins/widgets/links/types.ts` |
| `src/plugins/widgets/literatureClock/LiteratureClock.tsx` |
| `src/plugins/widgets/literatureClock/LiteratureClockSettings.tsx` |
| `src/plugins/widgets/message/Message.tsx` |
| `src/plugins/widgets/message/MessageSettings.tsx` |
| `src/plugins/widgets/quote/Quote.tsx` |
| `src/plugins/widgets/quote/QuoteSettings.tsx` |
| `src/plugins/widgets/quote/api.ts` |
| `src/plugins/widgets/search/Search.tsx` |
| `src/plugins/widgets/search/SearchSettings.tsx` |
| `src/plugins/widgets/search/engines.ts` |
| `src/plugins/widgets/search/types.ts` |
| `src/plugins/widgets/time/Time.tsx` |
| `src/plugins/widgets/time/TimeSettings.tsx` |
| `src/plugins/widgets/todo/Todo.tsx` |
| `src/plugins/widgets/todo/TodoSettings.tsx` |
| `src/plugins/widgets/todo/index.ts` |
| `src/plugins/widgets/todo/types.ts` |
| `src/plugins/widgets/weather/LocationInput.tsx` |
| `src/plugins/widgets/weather/Weather.sass` |
| `src/plugins/widgets/weather/Weather.tsx` |
| `src/plugins/widgets/weather/WeatherSettings.tsx` |
| `src/plugins/widgets/weather/api.ts` |
| `src/plugins/widgets/weather/conditions.ts` |
| `src/plugins/widgets/weather/types.ts` |
| `src/plugins/widgets/workHours/WorkHoursSettings.tsx` |
| `src/views/App.tsx` |
| `src/views/settings/Background.tsx` |
| `src/views/settings/Persist.tsx` |
| `src/views/settings/PositionInput.tsx` |
| `src/views/settings/Settings.tsx` |
| `src/views/settings/System.tsx` |
| `src/views/settings/Widget.tsx` |
| `src/views/settings/WidgetDisplay.tsx` |
| `src/views/settings/Widgets.tsx` |
| `src/views/shared/Crashed.tsx` |
| `src/views/shared/Errors.tsx` |
| `src/views/shared/Plugin.tsx` |
| `src/views/shared/StoreError.tsx` |
| `src/views/shared/ToggleSection.tsx` |
| `src/views/shared/icons/Icon.tsx` |
| `src/views/shared/timeZone/TimeZoneInput.tsx` |
| `target/chromium/manifest.json` |
| `target/firefox/manifest.json` |
| `webpack.config.js` |

</details>

<details>
<summary>삭제 96개</summary>

| 파일 경로 |
| --- |
| `.env.example` |
| `CONTRIBUTING.md` |
| `TRANSLATING.md` |
| `src/errorHandler.ts` |
| `src/locales/lang/ar.json` |
| `src/locales/lang/ca-ES.json` |
| `src/locales/lang/cs.json` |
| `src/locales/lang/de.json` |
| `src/locales/lang/el.json` |
| `src/locales/lang/en-AU.json` |
| `src/locales/lang/en-CA.json` |
| `src/locales/lang/en-GB.json` |
| `src/locales/lang/es.json` |
| `src/locales/lang/fa.json` |
| `src/locales/lang/fi.json` |
| `src/locales/lang/fr.json` |
| `src/locales/lang/ga.json` |
| `src/locales/lang/gd.json` |
| `src/locales/lang/gl.json` |
| `src/locales/lang/gu.json` |
| `src/locales/lang/he.json` |
| `src/locales/lang/hi.json` |
| `src/locales/lang/hu.json` |
| `src/locales/lang/id.json` |
| `src/locales/lang/it.json` |
| `src/locales/lang/ja.json` |
| `src/locales/lang/kp.json` |
| `src/locales/lang/lb.json` |
| `src/locales/lang/lt.json` |
| `src/locales/lang/ne.json` |
| `src/locales/lang/nl.json` |
| `src/locales/lang/no.json` |
| `src/locales/lang/pl.json` |
| `src/locales/lang/pt-BR.json` |
| `src/locales/lang/pt.json` |
| `src/locales/lang/ro.json` |
| `src/locales/lang/ru.json` |
| `src/locales/lang/sk.json` |
| `src/locales/lang/sr.json` |
| `src/locales/lang/sv.json` |
| `src/locales/lang/ta.json` |
| `src/locales/lang/th.json` |
| `src/locales/lang/tr.json` |
| `src/locales/lang/uk.json` |
| `src/locales/lang/vi.json` |
| `src/locales/lang/whitelist_ca-ES.json` |
| `src/locales/lang/whitelist_cs.json` |
| `src/locales/lang/whitelist_de.json` |
| `src/locales/lang/whitelist_el.json` |
| `src/locales/lang/whitelist_en-AU.json` |
| `src/locales/lang/whitelist_en-CA.json` |
| `src/locales/lang/whitelist_en-GB.json` |
| `src/locales/lang/whitelist_es.json` |
| `src/locales/lang/whitelist_fa.json` |
| `src/locales/lang/whitelist_fi.json` |
| `src/locales/lang/whitelist_fr.json` |
| `src/locales/lang/whitelist_ga.json` |
| `src/locales/lang/whitelist_gd.json` |
| `src/locales/lang/whitelist_gl.json` |
| `src/locales/lang/whitelist_gu.json` |
| `src/locales/lang/whitelist_he.json` |
| `src/locales/lang/whitelist_hi.json` |
| `src/locales/lang/whitelist_hu.json` |
| `src/locales/lang/whitelist_id.json` |
| `src/locales/lang/whitelist_it.json` |
| `src/locales/lang/whitelist_ja.json` |
| `src/locales/lang/whitelist_lb.json` |
| `src/locales/lang/whitelist_lt.json` |
| `src/locales/lang/whitelist_ne.json` |
| `src/locales/lang/whitelist_nl.json` |
| `src/locales/lang/whitelist_no.json` |
| `src/locales/lang/whitelist_pl.json` |
| `src/locales/lang/whitelist_pt-BR.json` |
| `src/locales/lang/whitelist_pt.json` |
| `src/locales/lang/whitelist_ro.json` |
| `src/locales/lang/whitelist_ru.json` |
| `src/locales/lang/whitelist_sk.json` |
| `src/locales/lang/whitelist_sr.json` |
| `src/locales/lang/whitelist_sv.json` |
| `src/locales/lang/whitelist_ta.json` |
| `src/locales/lang/whitelist_th.json` |
| `src/locales/lang/whitelist_tr.json` |
| `src/locales/lang/whitelist_uk.json` |
| `src/locales/lang/whitelist_vi.json` |
| `src/locales/lang/whitelist_zh-CN.json` |
| `src/locales/lang/whitelist_zh-TW.json` |
| `src/locales/lang/zh-CN.json` |
| `src/locales/lang/zh-TW.json` |
| `src/plugins/widgets/nba/Nba.sass` |
| `src/plugins/widgets/nba/Nba.tsx` |
| `src/plugins/widgets/nba/NbaSettings.tsx` |
| `src/plugins/widgets/nba/api.ts` |
| `src/plugins/widgets/nba/getPeriod.ts` |
| `src/plugins/widgets/nba/index.ts` |
| `src/plugins/widgets/nba/query.ts` |
| `src/plugins/widgets/nba/types.ts` |

</details>

## 원본 소스를 Tabliss Custom 소스로 바꾸기

위에 링크된 원본 커밋 `765a3f0`과 이 저장소의 Tabliss Custom 2.6.1 소스를 각각 내려받습니다. 두 폴더에서 `package.json`이 있는 위치를 기준으로 아래 작업을 진행합니다.

1. 원본 소스의 `src/`, `scripts/`, `target/` 폴더를 수정본의 같은 이름 폴더로 **통째로 교체**합니다. 원본 폴더에 파일을 합치면 수정본에서 삭제한 번역 파일과 NBA 위젯 파일이 남으므로, 원본 폴더를 먼저 다른 위치로 옮긴 다음 수정본 폴더를 복사합니다.
2. 원본 소스의 최상위에 수정본의 `package.json`, `package-lock.json`, `webpack.config.js`, `README.md`, `Original_README.md`, `CHANGELOG.md`를 복사합니다. 원본 README는 `Original_README.md`에 보관했습니다.
3. 수정본의 `.github/workflows/push.yml`을 원본 소스의 같은 경로에 복사하고, 원본 소스의 `.env.example`, `CONTRIBUTING.md`, `TRANSLATING.md`를 삭제합니다.

## 라이선스 및 출처

- 원본 Tabliss 2.6.0과 이 수정판은 **GPL-3.0-only**를 따릅니다. 라이선스 전문은 [LICENSE.txt](LICENSE.txt)에 있으며, 번들에 포함된 라이브러리의 라이선스 고지는 확장 폴더의 `main.js.LICENSE.txt`에 있습니다. [원본 2.6.0 라이선스 정보](https://addons.mozilla.org/en-US/firefox/addon/tabliss/versions/)
- `kma-forecast-locations.json`은 기상청 API허브의 **동네예보 지점 좌표(위경도), 2026-07-01** 자료를 JSON으로 변환한 파일입니다. [기상청 API허브](https://apihub.kma.go.kr/apiList.do?seqApi=10)
