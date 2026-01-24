# 티켓 관리 스킬

GitHub Issues를 활용한 티켓 생성, 업데이트, 완료 처리 가이드라인.

## GitHub Issues 관리

### Issue 라벨

| 라벨 | 설명 | 색상 |
|------|------|------|
| `feat` | 새로운 기능 | `#0E8A16` (녹색) |
| `fix` | 버그 수정 | `#D73A4A` (빨강) |
| `refactor` | 리팩토링 | `#FBCA04` (노랑) |
| `docs` | 문서 작업 | `#0075CA` (파랑) |
| `chore` | 설정/빌드 | `#BFDADC` (회색) |
| `priority: high` | 높은 우선순위 | `#B60205` |
| `priority: medium` | 중간 우선순위 | `#D93F0B` |
| `priority: low` | 낮은 우선순위 | `#FBCA04` |

### Issue 생성

```bash
# CLI로 Issue 생성
gh issue create --title "기능 제목" --body "설명" --label "feat,priority: medium"

# 또는 템플릿 사용
gh issue create --template feature_request.md
```

### Issue 템플릿 (`.github/ISSUE_TEMPLATE/`)

**feature_request.md:**
```markdown
---
name: 기능 요청
about: 새로운 기능 제안
labels: feat
---

## 설명
<!-- 기능에 대한 설명 -->

## 작업 내용
- [ ] 작업 1
- [ ] 작업 2

## 관련 파일
- `src/...`
```

**bug_report.md:**
```markdown
---
name: 버그 리포트
about: 버그 신고
labels: fix
---

## 버그 설명
<!-- 버그에 대한 설명 -->

## 재현 방법
1. ...
2. ...

## 기대 동작
<!-- 예상되는 올바른 동작 -->
```

## 브랜치 네이밍 규칙

Issue 번호를 포함한 브랜치명 사용:

| 타입 | 형식 | 예시 |
|------|------|------|
| 기능 | `feat/#이슈번호-설명` | `feat/#12-user-auth` |
| 버그 | `fix/#이슈번호-설명` | `fix/#15-login-error` |
| 리팩토링 | `refactor/#이슈번호-설명` | `refactor/#20-api-cleanup` |

```bash
# 브랜치 생성 예시
git checkout -b feat/#12-user-auth
```

## 커밋 메시지에 Issue 참조

```bash
# 커밋 메시지에 Issue 번호 포함
feat: 사용자 인증 기능 추가

- OAuth 로그인 구현
- 세션 관리 추가

Closes #12
```

| 키워드 | 동작 |
|--------|------|
| `Closes #번호` | PR 머지 시 Issue 자동 닫힘 |
| `Fixes #번호` | PR 머지 시 Issue 자동 닫힘 |
| `Refs #번호` | Issue 참조만 (닫지 않음) |

## PR과 Issue 연결

```bash
# PR 생성 시 Issue 연결
gh pr create --title "feat: 사용자 인증 기능" --body "Closes #12"
```

**PR 본문 템플릿:**
```markdown
## Summary
- 변경 사항 요약

## Related Issue
Closes #12

## Test Plan
- [ ] 테스트 1
- [ ] 테스트 2
```

## 워크플로우 예시

```bash
# 1. Issue 생성 (또는 GitHub 웹에서)
gh issue create --title "사용자 프로필 페이지 구현" --label "feat,priority: medium"
# → Issue #25 생성됨

# 2. 브랜치 생성
git checkout -b feat/#25-user-profile

# 3. 작업 및 커밋
git add .
git commit -m "feat: 사용자 프로필 페이지 추가

- 프로필 컴포넌트 구현
- API 연동

Refs #25"

# 4. PR 생성 (머지 시 Issue 자동 닫힘)
gh pr create --title "feat: 사용자 프로필 페이지" --body "Closes #25"

# 5. PR 머지 후 Issue 자동 완료
```

## Issue 조회 명령어

```bash
# 열린 Issue 목록
gh issue list

# 특정 라벨 필터
gh issue list --label "feat"
gh issue list --label "priority: high"

# 나에게 할당된 Issue
gh issue list --assignee @me

# Issue 상세 보기
gh issue view 25
```

## 마일스톤 활용 (선택)

```bash
# 마일스톤 생성
gh api repos/{owner}/{repo}/milestones -f title="v1.0" -f due_on="2024-03-01"

# Issue에 마일스톤 할당
gh issue edit 25 --milestone "v1.0"
```
