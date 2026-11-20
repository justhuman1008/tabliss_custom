# Tabliss Custom 개인정보처리방침 / Privacy Policy

시행일 · 2026년 11월 20일

이 방침은 Microsoft Edge용 Tabliss Custom 2.6.1에 적용됩니다. 이 확장 프로그램은 Edge의 새 탭을 사용자가 꾸밀 수 있는 대시보드로 바꿉니다.

## 저장하는 정보

- 확장 프로그램은 배경 주소, 위젯 배치, 빠른 링크, 이름이나 사용자 지정 문구, 메모, TODO, 날씨 위치 등 사용자가 설정하거나 입력한 내용을 브라우저의 확장 프로그램 저장소에 보관합니다. Edge에서 확장 프로그램 데이터 동기화를 사용하면 Microsoft Edge가 이 설정을 기기 간에 동기화할 수 있습니다.
- 업로드한 배경 이미지와 위젯 캐시 데이터는 해당 기기의 브라우저 저장소에 보관합니다. 사용자가 입력한 Unsplash, GIPHY, 공공데이터포털 API 키도 해당 기기에 보관합니다. 업로드한 배경 이미지와 API 키는 설정 내보내기 파일에 포함되지 않습니다.

## 외부 서비스로 보내는 정보

- 날씨 위젯은 Open-Meteo를 사용할 때 지역 검색어와 선택한 위치의 좌표를 해당 서비스에 보낼 수 있습니다. 현재 위치 기능은 브라우저 권한을 허용했을 때 브라우저 위치 정보를 사용합니다. 기상청·에어코리아를 선택하면 공공데이터포털 API에 사용자가 입력한 키와 조회 지역의 격자 또는 측정소 정보를 보냅니다.
- IP 정보 위젯은 IP 주소와 대략적인 위치를 표시하기 위해 ipwho.is에 요청합니다. 이 서비스는 요청을 보낸 IP 주소를 확인합니다.
- Unsplash나 GIPHY 배경을 선택하고 API 키를 입력하면 해당 서비스에 키와 이미지 조회에 필요한 옵션을 보냅니다. 이미지 주소를 직접 입력하면 해당 주소의 서버에서 이미지를 불러옵니다. 빠른 링크의 사이트 파바콘을 사용하면 Google 파바콘 서비스에 해당 사이트의 호스트명이 전달됩니다.
- 검색을 실행하면 검색어가 선택한 검색 엔진으로 전달됩니다. GitHub 잔디 위젯은 설정한 GitHub 사용자 이름을 `api.bloggify.net`의 GitHub Calendar 서비스로 보내 공개 기여 내역을 조회합니다. 인용구는 선택한 종류에 따라 `quotes.rest` 또는 `api.tabliss.io`, 유머는 `v2.jokeapi.dev`, 문학 시계는 `raw.githubusercontent.com`에서 콘텐츠를 요청합니다. 외부 서비스는 일반적인 네트워크 요청 정보인 IP 주소 등을 받을 수 있으며, 각 서비스의 개인정보처리방침에 따라 처리합니다.

Tabliss Custom은 개발자가 운영하는 서버로 사용자의 설정이나 오류 보고서를 전송하지 않습니다. 개발자는 확장 프로그램에서 처리하는 사용자 데이터를 판매하거나 광고에 사용하지 않습니다.

## 정보 관리 및 문의

확장 설정에서 위젯과 입력한 API 키를 삭제하고 대시보드 설정을 초기화할 수 있습니다. Edge 설정에서 위치 권한이나 동기화 설정을 변경할 수 있습니다. 내보낸 설정 파일에는 메모, 링크, 배경 주소, 날씨 위치 등이 포함될 수 있으므로 공유하기 전에 내용을 확인하세요.

설정과 API 키는 사용자가 변경하거나 삭제할 때까지 브라우저에 보관됩니다. 대시보드 설정 초기화는 설정과 위젯 캐시를 지우며, API 키는 각 서비스의 키 입력 항목에서 별도로 삭제할 수 있습니다. Microsoft 동기화 데이터와 외부 서비스의 요청 기록은 해당 서비스의 보관·삭제 정책이 적용됩니다. 사용자의 요청에 따라 전송된 API 키와 위치 등은 위에서 설명한 기능을 제공하는 데 사용되며, 신용도나 대출 자격 판단에 사용되지 않습니다.

문의는 [프로젝트 이슈 페이지](https://github.com/justhuman1008/tabliss_custom/issues)를 이용해 주세요. 공개 이슈에는 API 키나 개인정보를 올리지 마세요.

## English

Effective November 20, 2026.

This policy applies to Tabliss Custom 2.6.1 for Microsoft Edge. The extension provides a customizable dashboard on the Edge new tab page.

### Information stored by the extension

- Dashboard settings and content, including background URLs, widget layouts, quick links, names or custom messages, notes, to-do items, and weather locations, are stored in the browser's extension storage. Microsoft Edge may sync these settings across devices when extension data sync is enabled.
- Uploaded background images and widget caches are kept in browser storage on the device. User-supplied Unsplash, GIPHY, and Korean Public Data Portal API keys are also kept on the device. Uploaded backgrounds and API keys are excluded from settings exports.

### Information sent to external services

- The weather widget can send a location search term and the coordinates of the selected location to Open-Meteo. The current-location feature uses browser geolocation if you grant permission. If you choose KMA and AirKorea, the extension sends your API key and the relevant forecast grid or station information to the Korean Public Data Portal.
- The IP Info widget contacts ipwho.is to display your IP address and approximate location. That service receives the IP address used to make the request.
- If you choose Unsplash or GIPHY and enter an API key, the selected provider receives the key and the options needed for the image request. Image URLs you enter are loaded from the host you specify. The site favicon option sends the site's hostname to Google's favicon service.
- Search terms are sent to your selected search provider when you submit a search. The GitHub widget sends your configured GitHub username to the GitHub Calendar service at `api.bloggify.net` to retrieve public contributions. Quotes are requested from `quotes.rest` or `api.tabliss.io`, depending on the selected category. Jokes are requested from `v2.jokeapi.dev`, and literature clock content is requested from `raw.githubusercontent.com`. External services may receive standard connection information, such as your IP address, and process it under their own privacy policies.

Tabliss Custom does not send your settings or crash reports to a developer-operated server. The developer does not sell user data processed by the extension or use it for advertising.

### Your choices and contact

You can remove widgets and API keys or reset the dashboard in the extension's settings. You can manage location permission and sync in Edge settings. Settings exports can contain notes, links, background URLs, and weather locations. Review the file before sharing it.

Settings and API keys remain in browser storage until you change or remove them. Resetting the dashboard clears its settings and widget cache. API keys can be removed separately in each service's key settings. Microsoft sync data and external service request logs are subject to the relevant provider's retention and deletion policies. Information sent at your request, including API keys and locations, is used to provide the features described above and is not used to assess creditworthiness or lending eligibility.

For questions, use the [project's issue tracker](https://github.com/justhuman1008/tabliss_custom/issues). Please keep API keys and personal information out of public issues.
