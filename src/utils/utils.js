import moment from "moment/moment";
import { showToast } from "./toast";

export const formatDate = (formatIdentifier, inputdate) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    try {
        let currentDate = new Date();
        let date = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let type = formatIdentifier;
        if (type === "") {
            type = "-";
            return
        }
        if (type === "words" && !inputdate) {
            return date + "th day of " + monthNames[month - 1] + ", " + year
        }

        if (inputdate) {
            const _tmp = inputdate.split("-");
            return _tmp[2] + "th day of " + monthNames[_tmp[1] - 1] + ", " + _tmp[0];
        }

        return year + type + month + type + date;
    } catch (err) {
        console.log(err);
    }
}

export const generateUniqueID = (id) => {
    const uid = id?.slice(-5).toUpperCase();
    const day = new Date();
    const month = day.getMonth() + 1;
    const year = day.getFullYear().toString().slice(-2);

    return uid != undefined && `O${year}${month}${uid}`;
}

export const checkFileSize = (size) => {
    // checking if the uploaded file is less than or equal to 5 MB
    if (size > 5242880) {
        showToast('info', "Please upload file less than or equal to 5 MB");
        return;
    }
}

export const getInitials = (name) => {
    var initials = "";
    if (name == "" || name == undefined || name == null) {
        return "O";
    }
    const namearr = name.split(" ");
    if (namearr.length == 1) {
        initials = namearr[0][0];
    } else if (namearr.length > 1) {
        if (namearr[namearr.length - 1][0] == undefined) {
            namearr.pop();
        }
        initials = namearr[0][0] + namearr[namearr.length - 1][0];
    }
    // for (var i = 0; i < namearr.length; i++) {
    // initials += namearr[i][0];
    // }
    return initials.toUpperCase();
}

export const isEmpty = (data) => {
    return data ? data : "NA";
}

export const epochToTimestamp = (epoch) => {
    return moment(epoch).fromNow();
}

export const getStatus = (status, isApplicable) => {
    if (isApplicable == "yes") {
        return "NA";
    }
    if (status == 0) {
        return "Pending"
    }
    if (status == 1) {
        return "Submitted"
    }
    if (status == 2) {
        return "Validated"
    }
    if (status == 3) {
        return "Approved"
    }
    if (status == -1) {
        return "Queries"
    }
    if (status == undefined || status == "" || status == null) {
        return "NA"
    }
}

export const getStatusIcon = (status) => {
    if (status === 0) {
        return "fa-regular fa-clock ms-1"
    }
    if (status === 1) {
        return "fa-solid fa-check text-yellow-400 fa-xl ms-1"
    }
    if (status === 2) {
        return "fa-solid fa-check text-green-400 fa-xl ms-1"
    }
}

export const states = [
    {
        companyState: "Maharashtra",
        companyAddress: "3rd Floor, Omnicom House, opp. Grand Hyatt, Santacruz East, Mumbai, Maharashtra 400055",
        gstinNumber: "27AAACR5190H1ZA"
    },
    {
        companyState: "Telangana",
        companyAddress: "Survey No. 39, 12th Floor, Meenakshi Techpark, Near Mindspace Circle, Gachibowli, Hyderabad, Telangana, 500032",
        gstinNumber: "36AAACR5190H1ZB"
    },
    {
        companyState: "Haryana",
        companyAddress: "Flat No 202 and 301, Global Business Square Bldg No 32, Sector 44, Institutional Area, Gurgaon, Haryana, 122002",
        gstinNumber: "06AAACR5190H1ZE"
    },
    {
        companyState: "Karnataka",
        companyAddress: "Second Floor, 24, Golf View Homes, Wind Tunnel Road, Murugeshpalya, Off. HAL Airport Road, Bengaluru (Bangalore) Urban,Karnataka, 560017",
        gstinNumber: "29AAACR5190H1Z6"
    },
    {
        companyState: "Tamil Nadu",
        companyAddress: "Suite No 308, Apeejay House C/o Apeejay Business Centre, 39/12Haddows Road, Nungambakkam, Chennai, Tamil Nadu, 600006",
        gstinNumber: "33AAACR5190H1ZH"
    },
]

const saveLogs = () => {
    
}