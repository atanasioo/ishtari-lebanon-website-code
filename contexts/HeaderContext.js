const { createContext, useState, useContext, useEffect, useRef } = require("react");


const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    

    const [headerColor, setHeaderColor] = useState("white");

    const [fontColor,setFontColor] = useState("dblack");
    var headerColorVar ;

   


    useEffect(()=>{
        const header = document.getElementById('headerh');
      
    
        const bgColor = window.getComputedStyle(header).backgroundColor;
        headerColorVar = bgColor
      
      // Convert the color to RGB values
      const rgb = headerColorVar
        .substring(4, headerColorVar.length - 1)
        .replace(/ /g, '').split(",");
        
      // Calculate the brightness using a simple formula
      const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
      
      if(brightness < 128){
        setFontColor("dblack")
      }else{
        setFontColor("dblack")
      }
 
      
    },[headerColor])
  
    return(
        <HeaderContext.Provider value={{ headerColor, setHeaderColor ,fontColor}}>
            { children }
        </HeaderContext.Provider>
    );
}

export const useHeaderColor= () => useContext(HeaderContext);