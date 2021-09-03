import React, { useState, useEffect } from 'react';

import './style/List.css'

function CreateList() {

    let [result, setResult] = useState()
    const [fullName, setFullName] = useState()
    const [contacts, setContacts] = useState()
    const [address, setAddress] = useState()
    const [description, setDescription] = useState()
    const [id, setId] = useState()
    const [display, setDisplay] = useState('none')
    let [addId, setAddId] = useState(0)
    let [addFirstName, setAddFirstName] = useState('None')
    let [addLastName, setAddLastName] = useState('None')
    let [addEmail, setAddEmail] = useState('None')
    let [addPhone, setAddPhone] = useState('None')
    const [data, setData] = useState('')
    let key, reverse, objElem, arrow;

    async function fetchData() {
        let url = 'http://www.fil1ltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D'
        let response = await fetch(url)
        console.log(response)
        if (response.ok) {
            let d = await response.json()
            if (data) {
                setData(data.concat(d))
            } else {
                setData(d)
            }
        } else {
            alert("Ошибка HTTP: ");
        }
    }

    useEffect(() => {
        if (!data) { fetchData() }
    })

    let i = (obj) => { return <h3 onClick={(event) => targetElem(event)}> <div className="id">{obj.id}</div> <div className="firstName">{obj.firstName}</div> <div className="lastName">{obj.lastName}</div> <div className="email">{obj.email}</div> <div className="phone">{obj.phone}</div> </h3> }

    let sorter = function (field, reverse) {
        let key = function (x) { return x[field] }
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }

    function sortRender() {
        data.sort(sorter(key, reverse))
        setResult(data.map(i))
    }

    function createList() {
        if (Object.keys(data).length) { result = data.map(i) } else { result = <p>loading</p> }
    }

    function changeReverse(target) {
        function restoreTitle() {
            target.parentElement.children[0].innerHTML = 'id'
            target.parentElement.children[1].innerHTML = 'Имя'
            target.parentElement.children[2].innerHTML = 'Фамилия'
            target.parentElement.children[3].innerHTML = 'Электронная почта'
            target.parentElement.children[4].innerHTML = 'Телефон'
        }
        if (target.className === 'id') {
            objElem = 1
            restoreTitle()
        } else if (target.className === 'firstName') {
            objElem = 3
            restoreTitle()
        } else if (target.className === 'lastName') {
            objElem = 5
            restoreTitle()
        } else if (target.className === 'email') {
            objElem = 7
            restoreTitle()
        } else {
            objElem = 9
            restoreTitle()
        }
        if (reverse === undefined) reverse = true
        if (result[0].props.children[objElem].props.children >= result[1].props.children[objElem].props.children) reverse = !reverse
        if (reverse) { arrow = '↑' } else { arrow = '↓' }
        key = target.className
        sortRender()
        target.innerHTML = target.innerHTML + arrow
    }

    function targetElem(event) {
        var index = data.findIndex(elem => elem.id === event.nativeEvent.path[1].children[0].innerHTML);
        if (!data[index].description && !data[index].address) {
            setAddress('None')
            setDescription('None')
        } else {
            setAddress(data[index].address.state + " " + data[index].address.city + " " + data[index].address.streetAddress)
            setDescription(data[index].description)
        }
        setId(event.nativeEvent.path[1].children[0].innerHTML + " ")
        setFullName(data[index].firstName + " " + data[index].lastName)
        setContacts(data[index].email + " " + data[index].phone)
        setDisplay('flex')
    }

    function hideModal() {
        setDisplay('none')
    }


    function addItem() {
        let arr = data;
        if (!data) return console.log('empty data')
        let item1 = arr[0].id
        let item2 = arr[1].id
        for (let i in arr) {
            if (item1 >= item2) { item2 = arr[i].id }
            if (item1 < item2) { item1 = item2; item2 = arr[i].id }
        }
        if (addId === 0) {
            addId = item1 + 1
        }
        let form = { id: addId, firstName: addFirstName, lastName: addLastName, email: addEmail, phone: addPhone }
        arr.push(form)
        setResult(arr)
    }

    function upCase(e, state) {
        if (e.target.value) { state(e.target.value[0].toUpperCase() + e.target.value.slice(1)) }
    }

    createList()


    return (<div className="list">
        <div className="list-title-group">
            <div className='id' onClick={e => changeReverse(e.target)}>id {arrow}</div>
            <div className='firstName' onClick={e => changeReverse(e.target)} >Имя {arrow}</div>
            <div className='lastName' onClick={e => changeReverse(e.target)} >Фамилия {arrow}</div>
            <div className='email' onClick={e => changeReverse(e.target)} >Электронная почта {arrow}</div>
            <div className='phone' onClick={e => changeReverse(e.target)} >Телефон {arrow}</div>
            <button onClick={() => fetchData('big')} className="btn">Скачать</button>
            <button onClick={addItem} className="btn">Добавить</button>
            <input onChange={event => setAddId(Number(event.target.value))} placeholder="Enter id" className="input addId" type="text" />
            <input onChange={event => upCase(event, setAddFirstName)} placeholder="Enter first name" className="input addFirstName" type="text" />
            <input onChange={event => upCase(event, setAddLastName)} placeholder="Enter last name" className="input addLastName" type="text" />
            <input onChange={event => upCase(event, setAddEmail)} placeholder="Enter email" className="input addEmail" type="text" />
            <input onChange={event => setAddPhone(event.target.value)} placeholder="Enter phone" className="input addPhone" type="text" />
        </div >
        <div className="val">
            {result}
        </div>
        <div onClick={() => hideModal()} style={{ display: display }} className="modal-bar-background"></div>
        <div className="wrap-bar">
            <div style={{ display: display }} className="modal-bar">
                <div className="modal-bar-header">
                    <div className="modal-bar-title">
                        Подробная информация
                        </div>
                    <div className="modal-bar-close-button">
                        <img onClick={() => hideModal()} src='' alt="[X]" />
                    </div>
                </div>
                <div className="modal-bar-content">
                    <div className="modal-bar-content">
                        Индетификационный номер : {id} <br /> Имя : {fullName} <br /> Способы связи : {contacts} <br /> Адрес : {address} <br /> Описание : {description}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}


export default CreateList;