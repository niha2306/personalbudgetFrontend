import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [budgetData, setBudgetData] = useState(null);
    const [title, setTitle] = useState({ value: '', error: '' });
    const [budget, setBudget] = useState({ value: '', error: '' });
    const [month, setMonth] = useState({ value: '', error: '' });
    const [refresh, setRefresh] = useState(false);
    const [closeForm, setCloseForm] = useState(false);
    const [formTitle, setFormTitle] = useState('Add Budget');
    const [budgetId, setBudgetId] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null || token === '') {
            navigate('/login', { replace: true });
        }
    }, []);

    useEffect(() => {
        axios.get('https://lazy-plum-blackbuck-hem.cyclic.app/api/budget')
            .then(res => setBudgetData(res.data))
            .catch(error => console.log(error));
    }, [refresh])

    const monthOptions = [
        {
            name: 'Select Month',
            value: 0,
        },
        {
            name: 'January',
            value: 1
        },
        {
            name: 'February',
            value: 2
        },
        {
            name: 'March',
            value: 3
        },
        {
            name: 'April',
            value: 4
        },
        {
            name: 'May',
            value: 5
        },
        {
            name: 'June',
            value: 6
        },
        {
            name: 'July',
            value: 7
        },
        {
            name: 'August',
            value: 8
        },
        {
            name: 'September',
            value: 9
        },
        {
            name: 'October',
            value: 10
        },
        {
            name: 'November',
            value: 11
        },
        {
            name: 'December',
            value: 12
        },
    ];

    const onFinish = async () => {
        try {
            console.log(budgetId, title, budget, month);
            if (budgetId) {
                await axios.put(`https://lazy-plum-blackbuck-hem.cyclic.app/api/budget/${budgetId}`, {
                    title: title.value,
                    budget: budget.value,
                    month: month.value
                });
                alert('budget updated sucessfully');
                setTitle({ value: '', error: '' });
                setBudget({ value: '', error: '' });
                setMonth({ value: '', error: '' });
            } else {
                await axios.post('https://lazy-plum-blackbuck-hem.cyclic.app/api/budget', {
                    title: title.value,
                    budget: budget.value,
                    month: month.value
                });
                alert('budget added sucessfully');
                setTitle({ value: '', error: '' });
                setBudget({ value: '', error: '' });
                setMonth({ value: '', error: '' });
                setCloseForm(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteBudget = async (id) => {
        try {
            await axios.delete(`https://lazy-plum-blackbuck-hem.cyclic.app/api/budget/${id}`);
            alert('Budget deleted Successfully');
        } catch(error) {
            console.log(error);
        }
    }
    const validateForm = (e) => {
        e.preventDefault();
        let valid = true;
        if (title.value === '' || title.value === null) {
            setTitle({
                ...title,
                error: "Please Enter Title Of Budget"
            });
            valid = false;
        }
        if (budget.value === '' || budget.value === null) {
            setBudget({
                ...budget,
                error: "Please Enter the Budget"
            });
            valid = false;
        }
        if (month.value === '' || month.value === null) {
            setMonth({
                ...month,
                error: "Please Select the Month"
            });
            valid = false;
        }

        if (valid) {
            onFinish();
        }
    }

    const resetFormFields = () => {
        setTitle({ value: '', error: '' });
        setBudget({ value: '', error: '' });
        setMonth({ value: '', error: '' });
    }

    return (
        <div className="homePageBackground">
            <div className="container">
                <div style={{ display: 'flex', marginLeft: 'auto', marginTop: '50px' }}>
                    <h2>Budget</h2>
                    <button type="button" className="btn btn-primary"
                        data-toggle="modal"
                        data-target="#myModal"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => {
                            setTitle({ value: '', error: '' });
                            setBudget({ value: '', error: '' });
                            setMonth({ value: '', error: '' });
                            setFormTitle('Add Budget')
                        }}>
                        Add Budget
                    </button>
                </div>

                <table className="table table-bordered table-striped mt-3" style={{ background: '#0d0d0d', borderRadius: '15px', color: 'white' }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>budget</th>
                            <th>Month</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            budgetData?.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{data?.title}</td>
                                        <td>{data?.budget}</td>
                                        <td>{data?.month}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <button className="btn btn-primary ml-5" data-toggle="modal" data-target="#myModal" onClick={() => {
                                                    setTitle({ value: data?.title, error: '' });
                                                    setBudget({ value: data?.budget, error: '' });
                                                    setMonth({ value: data?.month, error: '' });
                                                    setBudgetId(data?._id);
                                                    setFormTitle('Edit Budget');
                                                }}>Edit</button>
                                                <button className="btn btn-danger ml-5" onClick={() => {
                                                    deleteBudget(data?._id);
                                                }}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="modal" id="myModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{formTitle}</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={validateForm}>
                                <input value={budgetId} hidden={true} />
                                <div className="form-group">
                                    <label htmlFor="title">Title:</label>
                                    <input type="text" className="form-control" id="title" value={title.value} onChange={(e) => setTitle({ value: e.target.value, error: '' })} />
                                    <p style={{ color: 'red' }}>{title.error && title.error}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="budget">Budget:</label>
                                    <input type="text" className="form-control" id="budget" value={budget.value} onChange={(e) => setBudget({ value: e.target.value, error: '' })} />
                                    <p style={{ color: 'red' }}>{budget.error && budget.error}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dropdownSelect">Select Month:</label>
                                    <select className="form-control" id="dropdownSelect" name="selectedOption" value={month.value} onChange={(e) => setMonth({ value: e.target.value, error: '' })}>
                                        {
                                            monthOptions.map((month, index) => {
                                                return (
                                                    <option value={month.value} key={index}>{month.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <p style={{ color: 'red' }}>{month.error && month.error}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={resetFormFields}>Close</button>
                                    <button type="submit" className="btn btn-primary">{formTitle}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;