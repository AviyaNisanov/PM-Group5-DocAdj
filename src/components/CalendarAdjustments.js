import EditableAdjustments from './EditableAdjustments';
import AdjusntmetsPage from './AdjusntmetsPage';
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db} from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import "../index.css";
function CalendarAdjustments() {
    const [editMode, setEditMode] = useState(false);

    const [Workdays, setWorkDays] = useState(" ");
    const [WorkFrom, setWorkFrom] = useState(" ");
    const [WorkUntil, setWorkUntil] = useState(" ");
    const [BreakFrom, setBreakFrom] = useState(" ");
    const [BreakUntil, setBreakUntil] = useState(" ");
    const [VactionFrom, setVactionFrom] = useState(" ");
    const [VactionUntil, setVactionUntil] = useState(" ");
    const [durationOne, setDurationOne] = useState(" ");
    const [durationTwo, setDurationTwo] = useState(" ");
    
    const stored = {Workdays, WorkFrom, WorkUntil, BreakFrom, BreakUntil, VactionFrom, VactionUntil, durationOne, durationTwo};
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    const fetchUserName = async () => {
    const q = query(collection(db, "doctor_calendar_settings"), where("uid", "==", user?.uid));
    const doc = await getDocs(q);
    const data = doc.docs[0].data();
    setWorkDays(data.workdays);
    setWorkFrom(data.work_from);
    setWorkUntil(data.work_until);
    setBreakFrom(data.break_from);
    setBreakUntil(data.break_until);
    setVactionFrom(data.vaction_from);
    setVactionUntil(data.vaction_until);
    setDurationOne(data.duration_one);
    setDurationTwo(data.duration_two);
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        fetchUserName();
    }, [user, loading]);
    

    function handleEditComplete(result) {
        console.log("handleEditComplete", result);
        if (result != null) {
            setWorkDays(result.workdays);
            setWorkFrom(result.work_from);
            setWorkUntil(result.work_until);
            setBreakFrom(result.break_from);
            setBreakUntil(result.break_until);
            setVactionFrom(result.vaction_from);
            setVactionUntil(result.vaction_until);
            setDurationOne(result.duration_one);
            setDurationTwo(result.duration_two);
        }
        setEditMode(false);
    }

    return (
    <div>
        <div>
            <div className="adj">
                {
                    editMode
                        ? <>
                            <EditableAdjustments
                                stored={stored}
                                editCompleteCallback={handleEditComplete}
                            />
                        </>
                        : <>
                            <AdjusntmetsPage
                                stored={stored}
                                startEditCallback={() => setEditMode(true)}
                            />
                        </>
                }
            </div>

        </div>
    </div>
    );
}
export default CalendarAdjustments;