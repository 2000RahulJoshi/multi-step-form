let storeDataInLocalStorage = {};
const formValidation = formSelector =>{

    const selectFormElement = document.querySelector(formSelector);

    const formStep = Array.from(selectFormElement.querySelectorAll("[formStep]"));

    const validationOption = [
        {
            attribute : 'customMinLength',
            isValid : input => input.value && input.value.length >= parseInt(input.getAttribute('customMinLength'),10),   //base 10
            errorMessage : (input,label) => `** ${label.textContent} should have at least ${input.getAttribute('customMinLength')} characters`
        },
        {
            attribute : 'exactLength',
            isValid : input => input.value && input.value.length === parseInt(input.getAttribute('exactLength'),10),
            errorMessage : (input,label) => `** ${label.textContent} should have ${input.getAttribute('exactLength')} digits`
        },
        {
            attribute : 'pattern',
            isValid : input =>{
                const regex = new RegExp(input.pattern);
                return regex.test(input.value);
            },
            errorMessage : (input,label) => `** Invalid ${label.textContent} `
        },
        {
            attribute : 'match',
            isValid : input =>{
                const confirmPass = input.getAttribute('match');
                const userPass = selectFormElement.querySelector(`#${confirmPass}`);
                return userPass && userPass.value.trim() === input.value.trim()
            },
            errorMessage : (input,label) => {
                const confirmPass = input.getAttribute('match');
                const userPass = selectFormElement.querySelector(`#${confirmPass}`);
                const matchedLabel = userPass.parentElement.parentElement.querySelector('label')
                return `** ${label.textContent} should match ${matchedLabel.textContent}`
            }
        },
        
        {
            attribute : 'required',
            isValid : input => input.value.trim() !== '',
            errorMessage : (input,label) => `** ${label.textContent} is required`
        }
    ];


    const validateEachGroup = (a) =>{
        const label = a.querySelector('label');
        const inputFields = a.querySelector('input,textarea');
        const errorMessageDiv = a.querySelector('.errorMessage');
        const errorIconDanger = a.querySelector('.errorDanger');
        const errorIconSuccess = a.querySelector('.errorSuccess');
        
        let formError = false;
        for(let val of validationOption){
            if(inputFields && inputFields.hasAttribute(val.attribute) && !val.isValid(inputFields)){
                errorMessageDiv.textContent = val.errorMessage(inputFields,label);
                inputFields.classList.add('border-danger')
                inputFields.classList.remove('border-success')
                inputFields.classList.add('border-2')
                errorIconDanger.style.display = "block"
                errorIconSuccess.style.display = "none"
                formError = true;
            }
        }

        if(inputFields && !formError){
            errorMessageDiv.textContent = "";
            inputFields.classList.add('border-success')
            inputFields.classList.remove('border-danger')
            inputFields.classList.add('border-2')
            errorIconDanger.style.display = "none"
            errorIconSuccess.style.display = "block"
            return true;
        }

        if(!inputFields){
            return true;
        }
        
    }

    let currentPage = formStep.findIndex( (step)=>{
        return step.classList.contains("isActive");
    });

    if(currentPage<0){
        currentPage=0;
        showCurrentPage()
    }

    selectFormElement.setAttribute('novalidate','');
    selectFormElement.addEventListener('click',function(e){
        let increment;
        if(e.target.matches("[nextPage]")){
            increment = 1;
        }
        else if(e.target.matches("[prevPage]")){
            increment = -1;
        }
        if(increment == null)   return;
        if(e.target.matches("[prevPage]")){
            currentPage += increment;
            input=Array.from(formStep[currentPage].querySelectorAll('input'));
            showCurrentPage();
        }
        else if(checkValidation(formStep[currentPage])){
            const inputDataFields = Array.from(formStep[currentPage].querySelectorAll('input'));
            const textAreaFields = Array.from(formStep[currentPage].querySelectorAll('textarea'));
            const sectionFields = Array.from(formStep[currentPage].querySelectorAll('select'));
            inputDataFields.forEach( (key)=>{
                storeDataInLocalStorage[key.name] = key.value;
            })

            textAreaFields.forEach( (key)=>{
                storeDataInLocalStorage[key.name] = key.value;
            })

            sectionFields.forEach( (key)=>{
                storeDataInLocalStorage[key.name] = key.value;
            })

            localStorage.setItem('formData',JSON.stringify(storeDataInLocalStorage));
            currentPage += increment;
            showCurrentPage()
        }
    });

    selectFormElement.addEventListener('submit',function(e){
        e.preventDefault();
        currentPage=2;
        if(checkValidation(formStep[currentPage])){
            currentPage = 2;
            const inputDataFields = Array.from(formStep[currentPage].querySelectorAll('input'));
            const textAreaFields = Array.from(formStep[currentPage].querySelectorAll('textarea'));
            const sectionFields = Array.from(formStep[currentPage].querySelectorAll('select'));
            inputDataFields.forEach( (key)=>{
            storeDataInLocalStorage[key.name] = key.value;
        })

        textAreaFields.forEach( (key)=>{
            storeDataInLocalStorage[key.name] = key.value;
        })

        sectionFields.forEach( (key)=>{
            storeDataInLocalStorage[key.name] = key.value;
        })

        delete storeDataInLocalStorage["Password"];
        delete storeDataInLocalStorage["Confirm Password"];
        let maskedPhoneNo = storeDataInLocalStorage["Phone No."];
        let maskedAadharNo = storeDataInLocalStorage["Aadhar Card No."];

        let size1 = maskedPhoneNo.length-4;
        let size2 = maskedAadharNo.length-4;
        let startString1 = "";
        let startString2 = "";
        for(let i=0;i<size1;i++){
            startString1 += "*";
        }
        for(let i=0;i<size2;i++){
            startString2 += "*";
        }
        maskedPhoneNo = startString1+maskedPhoneNo.slice(size1);
        maskedAadharNo = startString2+maskedAadharNo.slice(size2)

        storeDataInLocalStorage["Phone No."] = maskedPhoneNo;
        storeDataInLocalStorage["Aadhar Card No."] = maskedAadharNo;

        localStorage.setItem('formData',JSON.stringify(storeDataInLocalStorage));
        const myForm = document.getElementById("registrationForm");
        document.getElementById("spin").style.display = "block"
        setTimeout(function(){
            myForm.reset();
            document.getElementById("spin").style.display = "none"
            currentPage=0;
            window.location.href = "display.html";
        },1500);
        }

    })

    const checkValidation = pageToValidate =>{
        const formGroups = Array.from(pageToValidate.querySelectorAll('.inputFieldDiv'))
        let flag = true;

        formGroups.forEach(val=>{
            if(!validateEachGroup(val)){
                flag = false;
            };
        })



        function containsSelect(element) {
            return element.querySelector('select') !== null;
        }
        

        const selectFields = formGroups.filter(containsSelect);
        const arr=[];
        selectFields.forEach(formGroup => {
            const selectField = formGroup.querySelector('select');
            arr.push(selectField.id);
        });
        
        for(let i=0;i<arr.length;i++){
            if(arr[i] === 'maritalStat'){
                if(checkMaritalStatus()){
                    flag = false;
                }
            }
            else if(arr[i] === 'jobProfile'){
                if(checkJobProfile()){
                    flag = false;
                }
            }
            else if(arr[i] === 'gender'){
                if(checkGender()){
                    flag = false;
                }
            }
        }
        return flag;
    }

    function showCurrentPage(){
        formStep.forEach( (step,index)=>{
            step.classList.toggle("isActive",index === currentPage);
        })
    }


}
formValidation('#registrationForm');












// check validation using function
function errorStyling(errorContainer,dangerIconContainer,successIconContainer,box,val){
    let error = document.getElementById(`${errorContainer}`)
    let dangerIcon = document.getElementById(`${dangerIconContainer}`);
    let succesIcon = document.getElementById(`${successIconContainer}`);
    let inputField = document.getElementById(`${box}`);
    if(val === 0){
        dangerIcon.style.display="none";
        succesIcon.style.display="none";
        inputField.classList.remove('border-danger')
        inputField.classList.remove('border-success')   
        error.innerText = "** field can not be empty"
    }
    else if(val < 0){
        dangerIcon.style.display="block";
        succesIcon.style.display="none";
        inputField.classList.add('border-danger')
        inputField.classList.remove('border-success')
    }
    else{
        error.innerText = "";
        succesIcon.style.display="block";
        dangerIcon.style.display="none";
        inputField.classList.remove('border-danger')
        inputField.classList.add('border-success')
    }
}


function checkName(fullName,key){
    let val = fullName;
    // console.log(key)
    let ch = key.toLowerCase();
    let inputField = document.getElementById("fullName");
    const regexFullName = /^[a-zA-Z\s.]{1,30}$/
    let flag = regexFullName.test(val);
    inputField.classList.add('border-2')
        if(val.length == 0){
            errorStyling('nameErrorContainer','userNameDangerIcon','userNameSuccessIcon','fullName',0);
        }
        else if ((!(ch >= 'a' && ch <= 'z') && ch !== 'Backspace' && ch != ' ') || !flag) {
            errorStyling('nameErrorContainer','userNameDangerIcon','userNameSuccessIcon','fullName',-1);
            return true;
        }
        else{
            errorStyling('nameErrorContainer','userNameDangerIcon','userNameSuccessIcon','fullName',1);
            return false;
        }
}

function checkEmail(emailId,key){
    const regexEmail = /^[0-9a-zA-Z_]{3,}@[a-zA-Z]{3,}[.]{1}[a-zA-Z.]{2,6}$/;
    let val = emailId;
    let inputField = document.getElementById("emailId");
    inputField.classList.add('border-2')
    if(val.length == 0){
        errorStyling('emailErrorContainer','userEmailDangerIcon','userEmailSuccessIcon','emailId',0);
    }
    else if(!regexEmail.test(key) && !regexEmail.test(val)){
        errorStyling('emailErrorContainer','userEmailDangerIcon','userEmailSuccessIcon','emailId',-1);
        return true;
    }
    else{
        errorStyling('emailErrorContainer','userEmailDangerIcon','userEmailSuccessIcon','emailId',1);
        return false;
    }
}

function checkPassword(password){
    let smallCh = 0;
    let capitalCh = 0;
    let numbers = 0;
    let specialCh = 0;
    let specialChString = "!@#$%^&*";
    let error = document.getElementById("passwordErrorContainer")
    let inputField = document.getElementById("userPassword");
    inputField.classList.add('border-2')

    for(let i=0;i<password.length;i++){
        if(password[i]>='a' && password[i]<='z'){
            smallCh++;
        }
        else if(password[i]>='A' && password[i]<='Z'){
            capitalCh++;
        }

        else if(password[i]>='0' && password[i]<='9'){
            numbers++;
        }
        else if(specialChString.includes(password[i])){
            specialCh++;
        }
    }

    let confirmUserPass = document.getElementById("confirmPassword").value;
    if(confirmUserPass !== ""){
        confirmPassword(password,confirmUserPass);
    }
    if(password.length == 0){
        errorStyling('passwordErrorContainer','userPasswordDangerIcon','userPasswordSuccessIcon','userPassword',0);
    }
    else if(password.length < 8){
        errorStyling('passwordErrorContainer','userPasswordDangerIcon','userPasswordSuccessIcon','userPassword',-1);
        error.innerHTML = "** Minimum Length should be eight";
    }
    else if(password.length > 30){
        errorStyling('passwordErrorContainer','userPasswordDangerIcon','userPasswordSuccessIcon','userPassword',-1);
        error.innerHTML = "** Maximum length can be thirty";
    }
    else if(!(smallCh>=1 && capitalCh>=1 && numbers>=1 && specialCh>=1)){
        errorStyling('passwordErrorContainer','userPasswordDangerIcon','userPasswordSuccessIcon','userPassword',-1);
        return true;
    }
    else{
        errorStyling('passwordErrorContainer','userPasswordDangerIcon','userPasswordSuccessIcon','userPassword',1);
        return false;
    }
}

function confirmPassword(userPassword,confirmPassword){
    let error = document.getElementById("confirmPasswordErrorContainer");
    let inputField = document.getElementById("confirmPassword");
    inputField.classList.add('border-2')
    if(userPassword == ""){
        errorStyling('confirmPasswordErrorContainer','confirmPasswordDangerIcon','confirmPasswordSuccessIcon','confirmPassword',0);
        error.innerHTML = "** Please create password first ";
        return false;
    }
    else if(userPassword !== confirmPassword){
        errorStyling('confirmPasswordErrorContainer','confirmPasswordDangerIcon','confirmPasswordSuccessIcon','confirmPassword',-1);
        error.innerHTML = "** Wrong password";
    }
    else{
        errorStyling('confirmPasswordErrorContainer','confirmPasswordDangerIcon','confirmPasswordSuccessIcon','confirmPassword',1);
        return false;
    }
}

function checkGender(){
    let userGender = document.getElementById("gender").value;
    let inputField = document.getElementById("gender");
    inputField.classList.add('border-2')
    let error = document.getElementById("genderErrorContainer");
    if(userGender == ''){
        error.innerText = "** Gender is required";
        inputField.classList.add("border-danger");
        inputField.classList.remove("border-success");
    }
    else{
        error.innerText = "";
        inputField.classList.remove("border-danger");
        inputField.classList.add("border-success");
    }
}


function checkMaritalStatus(){
    let userMaritalStat = document.getElementById("maritalStat").value;
    let inputField = document.getElementById("maritalStat");
    inputField.classList.add('border-2')
    let error = document.getElementById("maritalStatErrorContainer");
    if(userMaritalStat == ''){
        error.innerText = "** marital status is required";
        inputField.classList.add("border-danger");
        inputField.classList.remove("border-success");
        return true;
    }
    else{
        error.innerText = "";
        inputField.classList.remove("border-danger");
        inputField.classList.add("border-success");
        return false;
    }
}

function checkJobProfile(){
    let userJobProfile = document.getElementById("jobProfile").value;
    let inputField = document.getElementById("jobProfile");
    inputField.classList.add('border-2')
    let error = document.getElementById("jobProfileErrorContainer");
    if(userJobProfile == ''){
        error.innerText = "** job profile is required";
        inputField.classList.add("border-danger");
        inputField.classList.remove("border-success");
        return true;
    }
    else{
        error.innerText = "";
        inputField.classList.remove("border-danger");
        inputField.classList.add("border-success");
        return false;
    }
}

function removeGenderError(event){
    let error = document.getElementById("genderErrorContainer");
    let inputField = document.getElementById("gender");
    error.innerText = "";
    inputField.classList.remove("border-danger");
    inputField.classList.add("border-success");
    checkGender()
}

function removeMaritalError(event){
    let error = document.getElementById("maritalStatErrorContainer");
    let inputField = document.getElementById("maritalStat");
    error.innerText = "";
    inputField.classList.remove("border-danger");
    inputField.classList.add("border-success");
    checkMaritalStatus();
}


function jobProfileError(event){
    let error = document.getElementById("jobProfileErrorContainer");
    let inputField = document.getElementById("jobProfile");
    error.innerText = "";
    inputField.classList.remove("border-danger");
    inputField.classList.add("border-success");
    checkJobProfile();
}

function addressCheck(addressVal){
    if(addressVal.length === 0){
        errorStyling('addressErrorContainer','addressdDangerIcon','addressdSuccessIcon','address',-1);
        return true;
    }
    else{
        errorStyling('addressErrorContainer','addressdDangerIcon','addressdSuccessIcon','address',1);
        return false;
    }
}

function checkAdditionalNotes(additionalNotes){
    if(additionalNotes.length === 0){
        errorStyling('additionalNotesErrorContainer','additionalNotesDangerIcon','additionalNotesSuccessIcon','addNotes',-1);
        return true;
    }
    else{
        errorStyling('additionalNotesErrorContainer','additionalNotesDangerIcon','additionalNotesSuccessIcon','addNotes',11);
        return false;
    }
}

function checkPhone(phoneNo,key){
    let error = document.getElementById("phoneNoErrorContainer")
    const regexPhoneNo = /^[123456789][0-9]{9}$/;
    let phoneInInt = phoneNo;
    let inputField = document.getElementById("phoneno");
    inputField.classList.add('border-2')
    phoneNo = phoneNo.toString();
    phoneNo = phoneNo.trimEnd();
    if(phoneNo.length === 0){
        errorStyling('phoneNoErrorContainer','phoneNoDangerIcon','phoneNoSuccessIcon','phoneno',0);
        error.innerText = "** phone no can not be empty"
        return false;
    }
    if(!regexPhoneNo.test(phoneInInt)){
        errorStyling('phoneNoErrorContainer','phoneNoDangerIcon','phoneNoSuccessIcon','phoneno',-1);
        error.innerText = "** invalid phone no"
        return false;
    }
    if( !(key>=0 && key<=9) && key != 'Backspace' && key != 'ArrowDown' && key != 'ArrowRight' && key != 'ArrowUp' && key != 'ArrowLeft'){
        errorStyling('phoneNoErrorContainer','phoneNoDangerIcon','phoneNoSuccessIcon','phoneno',-1);
        error.innerText = "** phone no contains only digits";
    }
    else if(phoneNo.length >0 && phoneNo.length < 10){
        errorStyling('phoneNoErrorContainer','phoneNoDangerIcon','phoneNoSuccessIcon','phoneno',-1);
        return true;
    }
    
    else{
        error.innerHTML = "";
        errorStyling('phoneNoErrorContainer','phoneNoDangerIcon','phoneNoSuccessIcon','phoneno',1);
        return false;
    }
}

function checkAadhar(aadhar,key){
    let error = document.getElementById("aadharCardErrorContainer")
    const regexAadhar = /^[0-9]{12}$/;
    let aadharInt = aadhar;
    let inputField = document.getElementById("aadharCardNo");
    inputField.classList.add('border-2')
    aadhar = aadhar.toString();
    aadhar = aadhar.trimEnd();
    if(aadhar.length === 0){
        errorStyling('aadharCardErrorContainer','aadharCardDangerIcon','aadharCardSuccessIcon','aadharCardNo',0);
        error.innerText = "** aadhar card no. can not be empty"
        return false;
    }
    if(!regexAadhar.test(aadharInt)){
        errorStyling('aadharCardErrorContainer','aadharCardDangerIcon','aadharCardSuccessIcon','aadharCardNo',-1);
        error.innerText = "** invalid aadhar card no"
        return false;
    }
    if( !(key>=0 && key<=9) && key != 'Backspace' && key != 'ArrowDown' && key != 'ArrowRight' && key != 'ArrowUp' && key != 'ArrowLeft'){
        errorStyling('aadharCardErrorContainer','aadharCardDangerIcon','aadharCardSuccessIcon','aadharCardNo',-1);
        error.innerText = "** aadhar card contains only digits";
    }
    else if(aadhar.length >0 && aadhar.length < 10){
        errorStyling('aadharCardErrorContainer','aadharCardDangerIcon','aadharCardSuccessIcon','aadharCardNo',-1);
        return true;
    }
    
    else{
        error.innerHTML = "";
        errorStyling('aadharCardErrorContainer','aadharCardDangerIcon','aadharCardSuccessIcon','aadharCardNo',1);
        return false;
    }
}


function checkField(event,fieldName){
    let val = event.target.value;
    let key = event.key;
    if(fieldName === 'fullName' && checkName(val,key)){
        let error = document.getElementById("nameErrorContainer")
        error.innerText = "** invalid user name"
    }
    else if(fieldName === 'emailId' && checkEmail(val,key)){
        let error = document.getElementById("emailErrorContainer");
        error.innerText = "** invalid email id"
    }
    else if(fieldName === 'password' && checkPassword(val)){
        let error = document.getElementById("passwordErrorContainer");
        error.innerText = "** your password should contain at least one uppercase, lowercase & special character";
    }
    else if(fieldName === "confirmPassword"){
        let userPass = document.getElementById("userPassword").value;
        if(confirmPassword(userPass,val)){
            let error = document.getElementById("confirmPasswordErrorContainer");
            error.innerText = "** wrong password";
        }
    }
    else if(fieldName === 'address' && addressCheck(val)){
        let error = document.getElementById("addressErrorContainer");
        error.innerText = "** address can't be empty";
    }
    else if(fieldName == 'phoneNo' && checkPhone(val,key)){
        let error = document.getElementById("phoneNoErrorContainer")
        error.innerText = "** please enter 10 digit phone no.";
    }
    else if(fieldName == 'aadharCardNo' && checkAadhar(val,key)){
        let error = document.getElementById("aadharCardErrorContainer")
        error.innerText = "** please enter 12 digit aadhar card no.";
    }
    else if(fieldName == 'additionalNotes' && checkAdditionalNotes(val)){
        let error = document.getElementById("additionalNotesErrorContainer");
        error.innerText = "** field can't be empty";
    }
}

function displayPassword(event,passwordType){
    event.preventDefault();
    let fieldOne = document.getElementById("userPassword");
    let fieldTwo = document.getElementById("confirmPassword")
    let userPassType = fieldOne.type;
    let confirmPassType = fieldTwo.type;
    
    if(passwordType == "userPassword"){
        if(userPassType == "password"){
            fieldOne.type = "text";
        }
        else{
            fieldOne.type = "password";
        }
    }
    
    else{
        if(confirmPassType == "password"){
            fieldTwo.type = "text";
        }
        else{
            fieldTwo.type = "password";
        }
    }
}