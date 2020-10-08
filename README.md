# Cloning Twitter with React and Firebase

### firebase 기능, 메서드 정리

- 먼저 firebase 홈페이지 > 콘솔로 이동 > 프로젝트 생성
- 그 후에 나오는 코드를 fbase.js 파일에 적어준다.
- auth(login), firestore(db) 등 사용할 기능을 import 해준다.

<br>

#### User 생성, 로그인

- https://firebase.google.com/docs/auth/web/password-auth?hl=ko
- firebase.auth().createUserWithEmailAndPassword()
- firebase.auth().signInWithEmailAndPassword()

```javascript
const onSubmit = async (e) => {
  e.preventDefault();
  try {
    let data;
    if (newAccount) {
      data = await authService.createUserWithEmailAndPassword(email, password);
    } else {
      data = await authService.signInWithEmailAndPassword(email, password);
    }
    console.log(data);
  } catch (error) {
    setError(error.message);
  }
};
```

<br>

##### 외부 아이디로 로그인

- https://firebase.google.com/docs/reference/js/firebase.auth.GoogleAuthProvider
- firebase.auth.GoogleAuthProvider()
- firebase.auth.GithubAuthProvider()

```javascript
const onSocialClick = async (e) => {
  // 구글, 깃허브 로그인 하기
  const { name } = e.target;
  let provider;
  if (name === "google") {
    provider = new firebaseInstance.auth.GoogleAuthProvider();
  } else if (name === "github") {
    provider = new firebaseInstance.auth.GithubAuthProvider();
  }
  await authService.signInWithPopup(provider);
};
```

<br>

#### 현재 로그인한 사용자 가져오기

- https://firebase.google.com/docs/auth/web/manage-users?hl=ko
- firebase.auth().onAuthStateChanged()
- 이 속성을 이용해서 user가 있으면 home으로 없으면 login화면으로 가게 할 수 있다.
- 비슷한 속성으로 currentUser 이 있다.

```javascript
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
```

<br>

#### 현재 사용자 로그아웃하기

- https://firebase.google.com/docs/auth/web/password-auth?hl=ko
- firebase.auth().signOut()

```javascript
import { useHistory } from "react-router-dom";
const history = useHistory();
const onLogOutClick = () => {
  authService.signOut();
  history.push("/");
  // 위 속성은 단순히 로그아웃만 시키기 때문에 useHistory를 이용하여
  // /로 push 해주어야 한다.
};
```

<br>

#### DB 데이터 관리(CRUD): 생성, 읽기, 수정, 삭제

- https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference?hl=ko
- https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference?hl=ko

##### 생성

- firebase.firestore().collection("collection 이름").add()

```javascript
const onSubmit = async (e) => {
  e.preventDefault();
  await dbService.collection("aweets").add({
    text: aweet,
    createdAt: Date.now(),
    creatorId: userObj.uid,
  });
  setAweet("");
};
```

##### 읽기

- 리스너 분리: https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener
- firebase.firestore().collection("collection 이름").get()
- firebase.firestore().collection("collection 이름").onSnapshot()

```javascript
/* 실시간 X 
  const getAweets = async () => {
    const dbAweets = await dbService.collection("aweets").get();
    dbAweets.forEach((document) => {
      const aweetObject = {
        ...document.data(),
        id: document.id,
      };
      setAweets((prev) => [aweetObject, ...prev]);
    });
  };
  */
useEffect(() => {
  // getAweets();
  // 실시간 O
  const snapshot = dbService.collection("aweets").onSnapshot((snapshot) => {
    const aweetArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAweets(aweetArray);
  });
  return () => {
    // (위 리스너 분리 링크 확인) 오류가 떠서 확인해본 결과,
    // 이벤트 콜백이 호출되지 않도록 리스너를 분리해야 한다.
    snapshot();
  };
}, []);
```

##### 수정

- firebase.firestore().doc("collection 주소").update()

```javascript
const toggleEditing = () => {
  // editing이 true면 수정화면, false면 읽기화면이 보여짐
  // 토글버튼을 만들고 클릭시 수정가능
  setEditing((prev) => !prev);
};
const onSubmit = async (e) => {
  e.preventDefault();
  await dbService.doc(`aweets/${aweetObj.id}`).update({
    text: newAweet,
  });
  setEditing(false);
};
```

##### 삭제

- firebase.firestore().doc("collection 주소").delete()

```javascript
const onDeleteClick = async () => {
  const ok = window.confirm("Are you sure you want to delete this aweet?");
  if (ok) {
    await dbService.doc(`aweets/${aweetObj.id}`).delete();
  }
};
```

<br>

#### 사진 첨부 (firebase X)

- https://developer.mozilla.org/ko/docs/Web/API/FileReader
- new FileReader(), onloadend, readAsDataURL

```javascript
const onFileChange = (e) => {
  const { files } = e.target;
  const theFile = files[0];
  const reader = new FileReader();
  reader.onloadend = (finishedEvent) => {
    const { result } = finishedEvent.currentTarget;
    setAttachment(result);
  };
  reader.readAsDataURL(theFile);
};
const onClearAttachment = () => {
  // clear button
  setAttachment(null);
};
```

#### Firebase Storage

- https://firebase.google.com/docs/reference/js/firebase.storage.Storage?hl=ko

##### 생성

- https://firebase.google.com/docs/reference/js/firebase.storage.Reference?hl=ko
- firebase.storage().ref().child(유저아이디/랜덤값)
- putString()
- ref.getDownloadURL()

```javascript
// 위에서 했던 DB 생성 함수을 수정한다.
const onSubmit = async (e) => {
  e.preventDefault();
  let attachmentUrl = "";
  if (attachment !== "") {
    const attachmentRef = storageService
      .ref()
      .child(`${userObj.uid}/${uuidv4()}`);
    // uuidv4() 는 랜덤으로 값을 가져옴
    const response = await attachmentRef.putString(attachment, "data_url");
    attachmentUrl = await response.ref.getDownloadURL();
  }
  const aweetObj = {
    text: aweet,
    createdAt: Date.now(),
    creatorId: userObj.uid,
    attachmentUrl,
  };
  await dbService.collection("aweets").add(aweetObj);
  setAweet("");
  setAttachment("");
};
```

##### 삭제

- https://firebase.google.com/docs/reference/js/firebase.storage.Reference?hl=ko
- firebase.storage().refFromURL(collection 객체.이미지주소).delete()

```javascript
  // 위에서 했던 DB 삭제 함수에서 아래 명령을 추가해준다.
  await storageService.refFromURL(aweetObj.attachmentUrl).delete();
};
```
