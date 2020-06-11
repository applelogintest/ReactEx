import React,{useState,useEffect} from "react";
import axios from "axios";
export default function RecipeNews(props){
    const [news,setNews]=useState([]);
    const [fd,setFd]=useState('레시피');

    useEffect(()=>{
        axios.get("http://localhost:3355/recipe_news",{
            params:{
                fd:fd
            }
        }).then((result)=>{
            setNews(result.data)
            console.log(result.data)
        })
    },[])
    // deps => 사용하지 않으면 렌더링 할때마다 호출 => 무한루프
    // 이벤트 발생
    const onDataChange=(e)=>{
        setFd(e.target.value)
    }

    const onBtnClick=()=>{
        axios.get("http://localhost:3355/recipe_news",{
            params:{
                fd:fd
            }
        }).then((result)=>{
            setNews(result.data)
            console.log(result.data)
        })
    }
    const html=news.map((m)=>
        <table className={"table"}>
            <tr>
                <td><b><a href={m.link}>{m.title}</a></b></td>
            </tr>

            <tr>
                <td><b>{m.description}</b></td>
            </tr>

            <tr>
                <td className={"text-right"}>
                    {m.author}
                </td>
            </tr>
        </table>
    )

    return(
        <React.Fragment>
            <h1 className={"text-center"}>네이버 뉴스 검색</h1>
            <div className={"row"} style={{"margin":"0px auto","width":"700px"}} >
                <input type={"text"} className={"input-sm"} size={"20"} value={fd}
                onChange={onDataChange}/>
                <button className={"btn btn-sm btn-danger"}
                 onClick={onBtnClick}>
                    검색</button>
            </div>
            <div>
                <table className={"table"} style={{"margin":"0px auto","width":"700px"}}>
                    <tbody>
                        <tr>
                            <td>
                                {html}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}