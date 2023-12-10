import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkJWTExpired } from "./utils";

const Home = (props) => {
    const [budgetData, setBudgetData] = useState([null]);
    const [title, setTitle] = useState({ value: '', error: '' });
    const [budget, setBudget] = useState({ value: '', error: '' });
    const [month, setMonth] = useState({ value: '', error: '' });
    const [year, setYear] = useState({ value: '', error: '' });
    const [refresh, setRefresh] = useState(false);
    const [formTitle, setFormTitle] = useState('Add Budget');
    const [budgetId, setBudgetId] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [filteredBudget, setFilteredBudget] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);

    const userId = localStorage.getItem('userId');

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenExpired = checkJWTExpired(token);
        if (token === null || token === '' || isTokenExpired) {
            alert('Your session is expired. Please Login in again..');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        axios.get('https://lazy-plum-blackbuck-hem.cyclic.app/api/budget')
            .then(res => {
                const data = res.data;
                const filteredUserData = data?.filter((d) => {
                    if(d?.userId == userId) {
                        return data;
                    }
                })
                setBudgetData(filteredUserData);
                const years = new Set();
                for(const d of filteredUserData) {
                    years.add(d?.year);
                }
                const Years = [{name: 'Select Year', value: ''}];
                for(const y of years) {
                    Years.push({name: y, value: y});
                }
                setYears(Years);
            })
            .catch(error => console.log(error));
    }, [refresh, userId]);

    useEffect(() => {
        if(budgetData){
            let data = budgetData;
            if(selectedYear) {
                data = data?.filter((budget) => {
                    if(budget?.year === selectedYear) {
                        return budget;
                    }
                })
            }
            if(selectedMonth && selectedMonth >= 1 ) {
                data = data?.filter((budget) => {
                    if(budget?.month === selectedMonth) {
                        return budget;
                    }
                })
            } 
            if(searchTerm) {
                data = data?.filter((budget) => {
                    return budget?.title.toLowerCase().includes(searchTerm.toLowerCase());
                })
            }
            setFilteredBudget(data);
        }
    }, [budgetData, selectedMonth, selectedYear, searchTerm])



    const monthOptions = [
        {
            name: 'Select Month',
            value: '',
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
            console.log(budgetId, title, budget, month, year);
            if (budgetId) {
                await axios.put(`https://lazy-plum-blackbuck-hem.cyclic.app/api/budget/${budgetId}`, {
                    title: title.value,
                    budget: budget.value,
                    month: month.value,
                    year: year.value,
                    userId: userId,
                });
                alert('budget updated sucessfully');
                resetFormFields();
                setRefresh(!refresh);
            } else {
                await axios.post('https://lazy-plum-blackbuck-hem.cyclic.app/api/budget', {
                    title: title.value,
                    budget: budget.value,
                    month: month.value,
                    year: year.value,
                    userId: userId,
                });
                alert('budget added sucessfully');
                resetFormFields();
                setRefresh(!refresh);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteBudget = async (id) => {
        try {
            await axios.delete(`https://lazy-plum-blackbuck-hem.cyclic.app/api/budget/${id}`);
            alert('Budget deleted Successfully');
            setRefresh(!refresh);
        } catch (error) {
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
        if (year.value === '' || year.value === null) {
            setYear({
                ...year,
                error: "Please Select the Year"
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
        setYear({ value: '', error: '' });
        setBudgetId(null);
    }

    const getYearDropdown = () => {
        let currentYear = new Date().getFullYear();
        let years = [{name: 'Select Year', value: ''}];
        while (currentYear >= 2010) {
            years.push({ name: currentYear, value: currentYear });
            currentYear--;
        }
        return (
            <div className="form-group">
                <label htmlFor="dropdownSelect">Select Year:</label>
                <select className="form-control" id="dropdownSelect" name="selectedOption" value={year.value} onChange={(e) => setYear({ value: e.target.value, error: '' })}>
                    {
                        years.map((year, index) => {
                            return (
                                <option value={year.value} key={index}>{year.name}</option>
                            )
                        })
                    }
                </select>
                <p style={{ color: 'red' }}>{year.error && year.error}</p>
            </div>
        )
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
                            resetFormFields();
                            setFormTitle('Add Budget')
                        }}>
                        Add Budget
                    </button>
                </div>

                <div className="searchOptions">
                    <input type="search" className="form-control" placeholder="Search title...." onChange={(e) => setSearchTerm(e.target.value)} />
                    <select className="form-control ml-2" id="dropdownSelect" name="selectedOption" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        {
                            monthOptions.map((month, index) => {
                                return (
                                    <option value={month.value} key={index}>{month.name}</option>
                                )
                            })
                        }
                    </select>
                    <select className="form-control ml-2" id="dropdownSelect" name="selectedOption" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {
                            years.map((year, index) => {
                                return (
                                    <option value={year.value} key={index}>{year.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <table className="table table-bordered table-striped mt-3" style={{ background: '#0d0d0d', borderRadius: '15px', color: 'white' }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>budget</th>
                            <th>Month</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredBudget && filteredBudget?.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{data?.title}</td>
                                        <td>{data?.budget}</td>
                                        <td>{data?.month}</td>
                                        <td>{data?.year}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <button className="btn btn-primary ml-5" data-toggle="modal" data-target="#myModal" onClick={() => {
                                                    setTitle({ value: data?.title, error: '' });
                                                    setBudget({ value: data?.budget, error: '' });
                                                    setMonth({ value: data?.month, error: '' });
                                                    setYear({value: data?.year, error: ''});
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
                                                    <option value={month.value} key={month.value}>{month.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <p style={{ color: 'red' }}>{month.error && month.error}</p>
                                </div>
                                {getYearDropdown()}
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