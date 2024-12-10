import { Branch } from "./branch"
import { Institution } from "./institution"
import { School } from "./school"

export interface Scholars {
    id: number
    pfNumber: string
    scholarCode: string
    scholarFirstName: string
    scholarLastName: string
    scholarDOB: string
    gender: string
    branch: Branch
    scholarCategory: string
    yearOfJoiningHighSchoolProgram: string
    yearOfJoiningTertiaryProgram: string
    school: School
    institution: Institution
    donor: string
    //homeCounty: HomeCounty
    scholarType: string
    //countryOfOrigin: CountryOfOrigin2
}
