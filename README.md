# Tabliss Custom 2.6.1

Joel Shepherd의 [Tabliss 원본 main(765a3f0)](https://github.com/joelshepherd/tabliss/commit/765a3f0)을 바탕으로 수정한 버전입니다.

## 주요 변경 사항
[2.6.1 변경 기록](CHANGELOG.md)
- 설정과 위젯의 한국어 번역을 보완하고 다른 언어 번역을 제거했습니다.
- 빠른 링크의 아이콘 이미지를 외부 링크에서 불러 올 수 있게 변경했습니다.
- 검색창의 기본 문구를 바꿀 수 있게 했습니다.
- 이미지 링크 배경을 추가했습니다. 이미지 링크를 입력 하면 해당 이미지를 배경으로 사용 합니다.
- 배경을 변경했다가 다시 돌아와도 마지막에 사용한 이미지 정보를 그대로 사용합나다.
- Unsplash와 GIPHY에 개인 API 키를 입력할 수 있습니다.
- 날씨 위젯에서 한국 기상청을 선택할 수 있고, 공공데이터 API를 활용하여 한국에 맞는 지역 검색과 날씨, 온습도, 미세먼지 수치를 지원합니다.
- 원본 프로젝트로 오류를 보내는 Sentry 연동을 제거했습니다. 오류가 난 위젯의 안내는 새 탭에 표시됩니다.

## 라이선스 및 출처

- 원본 Tabliss 2.6.0과 이 수정판은 **GPL-3.0-only**를 따릅니다. 라이선스 전문은 [LICENSE.txt](LICENSE.txt)에 있으며, 번들에 포함된 라이브러리의 라이선스 고지는 확장 폴더의 `main.js.LICENSE.txt`에 있습니다. [원본 2.6.0 라이선스 정보](https://addons.mozilla.org/en-US/firefox/addon/tabliss/versions/)
- `kma-forecast-locations.json`은 기상청 API허브의 **동네예보 지점 좌표(위경도), 2026-07-01** 자료를 JSON으로 변환한 파일입니다. [기상청 API허브](https://apihub.kma.go.kr/apiList.do?seqApi=10)
