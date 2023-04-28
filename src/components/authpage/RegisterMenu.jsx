import React, { useState } from 'react';
// style.js & icons
import * as S from './LoginReigster.style';
import { BiUser, BiLockOpen } from 'react-icons/bi';
import {
  BsFlower2,
  BsFillCheckCircleFill,
  BsFillInfoCircleFill,
} from 'react-icons/bs';
import { MdOutlineVpnKey } from 'react-icons/md';
// components
import TopBar from '../_common/topbar/TopBar';
import Modal from '../_common/modal/Modal';
//api
import { RequestSignin, RequestAccount, RequestLogin } from '../../api/auth';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setUser, setUserTask } from '../../redux/userSlice';

const RegisterMenu = () => {
  // input 상태 관리
  const [id, setID] = useState('');
  const [password, setPW] = useState('');
  const [password2, setPW2] = useState('');
  const [name, setName] = useState('');
  const [secretWord, setSecretWord] = useState('');

  // redux
  const dispatch = useAppDispatch();
  const { isBooth, isTF } = useAppSelector(state => state.booth);

  // modal 관리
  const contents =
    '이화여자대학교 유레카 포털 \n 자유게시판에서 ‘이웃제’ 검색하여 확인';
  const [modal, setModal] = useState(false);
  const [secretModal, setSecretModal] = useState(false);
  const openModal = () => {
    setModal(true);
  };
  const openSModal = () => {
    setSecretModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
  const closeSModal = () => {
    setSecretModal(false);
  };
  // 필수 필드 확인 함수
  const checkInput = () => {
    return (
      checkID() === '' &&
      checkPW() === '' &&
      checkSecretWord() === '' &&
      checkName() === ''
    );
  };
  const checkID = () => {
    return id !== '' ? '' : '아이디 필드가 비어있습니다.\n';
  };
  const checkPW = () => {
    return password !== '' && password === password2
      ? ''
      : '비밀번호가 일치하지 않습니다.\n';
  };
  const checkSecretWord = () => {
    return secretWord === '비밀단어' ? '' : '비밀단어가 일치하지 않습니다.\n';
  };
  const checkName = () => {
    return name.length <= 10 && name !== ''
      ? ''
      : '닉네임은 10자 이하로 작성해주세요.';
  };
  const checkSubmit = e => {
    e.preventDefault();
    checkInput()
      ? openModal(true)
      : alert(checkID() + checkPW() + checkSecretWord() + checkName());
  };
  // Submit
  const onSubmitAccount = () => {
    RequestSignin(id, password, name).then(() => {
      RequestLogin(id, password)
        .then(res => {
          //아이디 비밀번호 닉네임 저장
          dispatch(
            setUser({
              ID: id,
              PW: password,
              nickname: res.data.data.nickname,
            }),
          );
        })
        .then(() => {
          // 계정 정보 가져오기
          RequestAccount().then(response => {
            dispatch(
              setUserTask({
                isBooth: response.data.data.is_t,
                isTF: response.data.data.is_tf,
              }),
            );
          });
        })
        .then(() => {
          window.location.reload();
          window.location.replace('/');
        });
    });
  };
  return (
    <>
      {secretModal ? (
        <Modal
          open={openSModal}
          close={closeSModal}
          title='비밀단어 안내'
          subTitle='회원가입을 위해서 비밀단어를 입력해주세요.'
          contents={contents}
          secret='true'
          onClick={closeSModal}
        />
      ) : null}
      {modal ? (
        <Modal open={openModal} close={closeModal} onClick={onSubmitAccount} />
      ) : null}
      <S.Container>
        <TopBar title='회원가입' />
        <S.LogoBox />
        <S.InputForm>
          <S.InputWrapper marginTop='15px'>
            <BiUser />
            <S.Input
              placeholder='아이디'
              onChange={e => setID(e.target.value)}
            />
          </S.InputWrapper>
          <S.InputWrapper marginTop='15px'>
            <BiLockOpen />
            <S.Input
              type='password'
              placeholder='비밀번호 (4자 이상)'
              onChange={e => setPW(e.target.value)}
            />
          </S.InputWrapper>
          <S.CheckWrapper>
            <S.InputWrapper width='205px'>
              <BiLockOpen />
              <S.Input
                type='password'
                placeholder='비밀번호 확인'
                onChange={e => {
                  setPW2(e.target.value);
                }}
              />
            </S.InputWrapper>
            {checkPW() === '' ? (
              <BsFillCheckCircleFill color=' #029C54' />
            ) : (
              <BsFillCheckCircleFill color='#EAEAEA' />
            )}
          </S.CheckWrapper>
          <S.InputWrapper marginTop='15px'>
            <BsFlower2 />
            <S.Input
              placeholder='닉네임'
              onChange={e => setName(e.target.value)}
            />
          </S.InputWrapper>
          <S.CheckWrapper>
            <S.InputWrapper width='205px'>
              <MdOutlineVpnKey />
              <S.Input
                placeholder='비밀단어'
                onChange={e => setSecretWord(e.target.value)}
              />
            </S.InputWrapper>
            <BsFillInfoCircleFill color='#FF9FC7' onClick={openSModal} />
          </S.CheckWrapper>
          <S.Button onClick={checkSubmit}>회원가입</S.Button>
        </S.InputForm>
      </S.Container>
    </>
  );
};

export default RegisterMenu;
