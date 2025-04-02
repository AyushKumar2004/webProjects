document.addEventListener('DOMContentLoaded',function(){
    const searchBtn=document.querySelector('#search-btn');
    const userNameInput=document.querySelector('#user-input');
    const statsContainer=document.querySelector('.stats-container');
    const easyProgressCircle=document.querySelector('.easy-Progress');
    const mediumProgressCircle=document.querySelector('.medium-Progress');
    const hardProgressCircle=document.querySelector('.hard-Progress');
    const easyLabel=document.querySelector('#easy-label');
    const mediumLabel=document.querySelector('#medium-label');
    const hardLabel=document.querySelector('#hard-label');
    const cardStatsContainer=document.querySelector('.stats-card');

    function validateUserName(userName){
        if(userName.trim()===""){
            alert("username should not be empty");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(userName);
        if(!isMatching){
            alert('Inavalid username')
        }
        return isMatching;
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty('--progress-degree',`${progressDegree}%`);
        label.textContent=`${solved}/${total}`
    }

    function displayUserData(data){
        const totalQues=data.totalQuestions;
        const totalEasyQues=data.totalEasy;
        const totalMediumQues=data.totalMedium;
        const totalHardQues=data.totalHard;

        const solvedTotalQues=data.totalSolved;
        const solvedTotalEasyQues=data.easySolved;
        const solvedTotalMediumQues=data.mediumSolved;
        const solvedTotalHardQues=data.hardSolved;


        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle)
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);

        const cardsData=[
            {label:"overall Submissions",value:solvedTotalQues},
            {label:"overall Easy Submissions",value:solvedTotalEasyQues},
            {label:"overall medium Submissions",value:solvedTotalMediumQues},
            {label:"overall hard Submissions",value:solvedTotalHardQues}
        ];

        console.log("card ka data",cardsData);
        cardStatsContainer.innerHTML=cardsData.map((data)=>{
            return `
                <div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>            
            `
        }).join("");
        statsContainer.style.setProperty("visibility","visible");
    }

    async function fetchUserDetails(userName){
        const url=`https://leetcode-stats-api.herokuapp.com/${userName}`;
        try{
            searchBtn.textContent="searching..";
            searchBtn.disabled=true;
            statsContainer.style.setProperty("visibility","hidden");
            const response=await fetch(url);
            if(!response.ok){
                throw new Error(e);
            }
            const data=await response.json();
            console.log(data);

            displayUserData(data);
        }catch(e){
            console.log(e);
            statsContainer.innerHTML="<p>No data found</p>"
        }finally{
            searchBtn.textContent="search";
            searchBtn.disabled=false;
        }
    }

    searchBtn.addEventListener('click',()=>{
        const userName=userNameInput.value;
        console.log(userName);
        if(validateUserName(userName)){
            fetchUserDetails(userName);
        }
    });
})