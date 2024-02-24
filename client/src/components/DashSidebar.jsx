import { Sidebar } from 'flowbite-react';
import {HiArrowSmRight, HiUser} from 'react-icons/hi';
import React, { useEffect,useState } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
    const {currentUser,error,loading}=useSelector(state=>state.user);
    const location =useLocation();
    const [tab,setTab] =useState('');
    const dispatch=useDispatch();
    const navigate=useNavigate();
    useEffect(()=>{
        const urlParams =new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(tabFromUrl){
        setTab(tabFromUrl)
        }
    },[location.search]);
    const handleSignout=async ()=>{
        try{
            const res =await fetch('api/user/signout',{
            method:'POST',
            });
            const data=await res.json();
            if(!res.ok){
            console.log(data.message)
            }
            if(res.ok){
            dispatch(signoutSuccess());
            navigate('/')
            }
        }catch(error){
            console.log(error.message)
        }
    }
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin': 'User'} labelColor='dark' as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                <Sidebar.Item icon={HiArrowSmRight} className='' onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>

                
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
