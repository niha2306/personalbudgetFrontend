import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { checkJWTExpired } from "./utils";

const Dashboard = () => {

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()+1;
    console.log(currentMonth);
    const [budgetData, setBudgetData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(`${currentMonth}`);
    const [filteredBudget, setFilteredBudget] = useState(null);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(`${currentYear}`);
    const [chartLabels, setChartLabels] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [charBackgrounds, setChartBackgrounds] = useState([]);
    const [monthlyAgg, setMonthlyAgg] = useState([]);
    const [yearlyAgg, setYearlyAgg] = useState([]); 
    const userId = localStorage.getItem('userId');


    const monthOptions = [
        {
            name: 'Select Month',
            value: '',
        },
        {
            name: 'January',
            value: '1'
        },
        {
            name: 'February',
            value: '2'
        },
        {
            name: 'March',
            value: '3'
        },
        {
            name: 'April',
            value: '4'
        },
        {
            name: 'May',
            value: '5'
        },
        {
            name: 'June',
            value: '6'
        },
        {
            name: 'July',
            value: '7'
        },
        {
            name: 'August',
            value: '8'
        },
        {
            name: 'September',
            value: '9'
        },
        {
            name: 'October',
            value: '10'
        },
        {
            name: 'November',
            value: '11'
        },
        {
            name: 'December',
            value: '12'
        },
    ];

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isTokenExpired = checkJWTExpired(token);
        if (token === null || token === '' || isTokenExpired) {
            alert('Your session is expired. Please Login in again..');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        }
    }, []);

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
                const Years = [{ name: 'Select Year', value: '' }];
                for (const y of years) {
                    Years.push({ name: y, value: y });
                }
                setYears(Years);
            })
            .catch(error => console.log(error));
    }, [refresh]);

    useEffect(() => {
        if (budgetData) {
            let data = budgetData;
            if (selectedYear) {
                data = data?.filter((budget) => {
                    if (budget?.year === selectedYear) {
                        return budget;
                    }
                })
            }
            if (selectedMonth && selectedMonth >= 1) {
                data = data?.filter((budget) => {
                    if (budget?.month === selectedMonth) {
                        return budget;
                    }
                })
            }
            console.log(data);
            setFilteredBudget(data);
        }
    }, [budgetData, selectedMonth, selectedYear]);

    //set Chart data
    useEffect(() => {
        if (filteredBudget) {
            const data = [], labels = [], backgroundColor = [];
            for (const b of filteredBudget) {
                data.push(b.budget);
                labels.push(b.title);
                var randomColor = Math.floor(Math.random() * 16777215).toString(16);
                backgroundColor.push(`#${randomColor}`);
            }
            setChartData(data);
            setChartLabels(labels);
            setChartBackgrounds(backgroundColor);
        }
    }, [filteredBudget]);

    useEffect(() => {
        if (charBackgrounds && chartData && chartLabels) {
            createBarChart();
        }
    }, [charBackgrounds, chartData, chartLabels])

    const createBarChart = () => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            BarElement,
            Title,
            Tooltip,
            Legend
        );
    
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Budget bar chart',
                },
            },
        };

        const data = {
            datasets: [
                {
                    label: '# of budget',
                    data: chartData,
                    backgroundColor: charBackgrounds,
                    borderWidth: 2,
                }
            ],
            labels: chartLabels
        }  
        return <Bar options={options} data={data} height={400} width={400}/>
    }

    const createPieChart = () => {
        ChartJS.register(ArcElement, Tooltip, Legend);
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Budget pie chart',
                },
            },
        };
        const data = {
            datasets: [
                {
                    label: 'budget',
                    data: chartData,
                    backgroundColor: charBackgrounds,
                    borderWidth: 2
                }
            ],
            labels: chartLabels,
        }  
        return <Pie data={data} options={options} height={300} width={300}/>
    }
    return (
        <div className="container">
            <div className="searchOptions">
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
            <div className="barchartstyle">
                <div className="stylechart">
               {createBarChart()}     
            </div>
            <div className="stylechart ml-4">
               {createPieChart()}     
            </div>
            </div>
        </div>
    )
};

export default Dashboard;