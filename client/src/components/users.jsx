import React from 'react';
import { useState, useEffect } from "react";
import Axios from 'axios';

const Checkbox = ({ type = "checkbox", checked = false, onChange, value }) => {
    return (
      <input type={type} className ='form-check-input' checked={checked} onChange={onChange} value={value} />
    );
};
function Users() {
    const [data, setData] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [checkedAll, setCheckedAll] = useState(false);
    const idUsers = [];

    useEffect(() =>{
        Axios.post('/showUsers', { user: 'Users' }).then((response) => {
            setData(response.data);
        });   
    },[])

    const handleChange = (event) => {
        const checkbox = document.querySelectorAll('.form-check-input');
        checkbox.forEach((el) => {
            if ( el.value!=='all' )
            checkedItems[el.value] = el.checked;
            
        })
        setCheckedItems({...checkedItems, [event.target.value] : event.target.checked });
    }

    const deleteUsers = (e) => {
        e.preventDefault();
		for(const key in checkedItems){
            if (Object.values(checkedItems).every((el) => el === true)) {
                Axios.post('/deleteUser',{
                    del:  'all'
                })
                .then((res)=>{
                    if (res.data === 'reload') {
                        localStorage.setItem('entries', JSON.stringify(false));
                    };
                    window.location.assign('/users')
                })
            } else if(checkedItems[key]){
                Axios.post('/deleteUser',{
                    del:  key
                })
                .then((res)=>{
                    if (res.data === 'reload') {
                        localStorage.setItem('entries', JSON.stringify(false));
                    };
                    window.location.assign('/users');
                })
            }
        }
	}

    const tableTemplate = data.map((row) => {
         return(
             <tbody>
            <tr key={row.Id}>
                <td><Checkbox checked={checkedItems[row.Id]}
                    onChange={handleChange} value ={row.Id}/>
                </td>
                <td >{row.Id}</td>
                <td >{row.Name}</td>
                <td >{row.Email}</td>
                <td >{row.Date_Regist}</td>
                <td >{row.Date_LastIn}</td>
                <td >{row.Status_user}</td>
            </tr>
            </tbody>
         );
    });

    const blockUser = (e) =>{
        e.preventDefault();
        for(const key in checkedItems){
            if (Object.values(checkedItems).every((el) => el === true)) {
                Axios.post('/blockUser',{
                    block:  'all'
                })
                .then((res)=>{
                    if (res.data === 'reload') {
                        localStorage.setItem('entries', JSON.stringify(false));
                    };
                    window.location.assign('/users');
                })
            } else if(checkedItems[key]){
                Axios.post('/blockUser',{
                    block:  key
                })
                .then((res)=>{
                    if (res.data === 'reload') {
                        localStorage.setItem('entries', JSON.stringify(false));
                    };
                    window.location.assign('/users');
                })
            }
        }
    }

    const unBlockUser = (e) =>{
        e.preventDefault();
        for(const key in checkedItems){
            if(checkedItems[key]){
                Axios.post('/unBlockUser',{
                    unblock:  key
                })
                .then(() =>{setData([])})
            }
            window.location.assign('/users')
        }
    }

    const selectAll = (value) => {
        const checkbox = document.querySelectorAll('.form-check-input');
        checkbox.forEach((el) => {
            if ( el.value!=='all' )
            checkedItems[el.value] = el.checked;
            
        })
        setCheckedAll(value);
        setCheckedItems((prevState) => {
          const newState = { ...prevState };
          for (const inputName in newState) {
            newState[inputName] = value;
          }
          return newState;
        });
      };

      const logOut = () => {
        localStorage.setItem('entries', JSON.stringify(false));
        window.location.assign('/users');
      }
    
    return(
        <div className = 'users'>
            <h1>Users</h1>
            <button className ='btn btn-outline-primary' onClick ={logOut}>LogOut</button>
            <span className = 'toolBar'>
                <button className = 'btn' onClick ={blockUser}><i className='fa fa-close'></i> Block User</button>
                <button className = 'btn' onClick ={deleteUsers}><i className='fa fa-trash'></i> Delete User</button>
                <button className = 'btn' onClick ={unBlockUser}><i className='fa fa-check'></i>Unblock User</button>
            </span>
            <table className ='table-light'>
            <tbody>
                <tr>
                    <th>Check All<br/>
                        <input type='checkbox' className ='form-check-input' value ='all' onChange={(event) => selectAll(event.target.checked)} checked={checkedAll}/>
                    </th>
                    <th>ID</th>
                    <th>Name(Login)</th>
                    <th>Email</th>
                    <th>Date Registration</th>
                    <th>Date Last Login</th>
                    <th>Status</th>
                </tr>
                </tbody>
                {tableTemplate}
            </table>
        </div>
    );
}

export default Users;