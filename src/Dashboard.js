import axios from "axios";
import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { checkJWTExpired } from "./utils";

const Dashboard = () => {

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1;
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
    const [monthlyAggLabels, setMonthlyAggLabels] = useState([]);
    const [monthlyAggData, setMonthlyAggData] = useState([]);
    const [yearlyAggLabels, setYearlyAggLabels] = useState([]);
    const [yearlyAggData, setYearlyAggData] = useState([]);
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
                    if (d?.userId == userId) {
                        return data;
                    }
                })
                setBudgetData(filteredUserData);
                const years = new Set();
                for (const d of filteredUserData) {
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
        function aggregateByYear(data) {
            const aggregatedData = {};

            data.forEach(entry => {
                const year = entry.year.toString();
                if (!aggregatedData[year]) {
                    aggregatedData[year] = {
                        totalBudget: 0,
                        monthlyData: {},
                    };
                }

                aggregatedData[year].totalBudget += parseFloat(entry.budget);
                const month = entry.month;
                if (!aggregatedData[year].monthlyData[month]) {
                    aggregatedData[year].monthlyData[month] = {
                        totalBudget: 0,
                        titles: {},
                    };
                }

                aggregatedData[year].monthlyData[month].totalBudget += parseFloat(entry.budget);

                const title = entry.title;
                if (!aggregatedData[year].monthlyData[month].titles[title]) {
                    aggregatedData[year].monthlyData[month].titles[title] = 0;
                }

                aggregatedData[year].monthlyData[month].titles[title] += parseFloat(entry.budget);
            });

            return aggregatedData;
        }

        function aggregateByMonth(data) {
            const aggregatedData = {};

            data.forEach(entry => {
                const monthYearKey = `${entry.month}/${entry.year}`;

                if (!aggregatedData[monthYearKey]) {
                    aggregatedData[monthYearKey] = {
                        totalBudget: 0,
                        titles: {},
                    };
                }

                aggregatedData[monthYearKey].totalBudget += parseFloat(entry.budget);

                const title = entry.title;
                if (!aggregatedData[monthYearKey].titles[title]) {
                    aggregatedData[monthYearKey].titles[title] = 0;
                }

                aggregatedData[monthYearKey].titles[title] += parseFloat(entry.budget);
            });

            return aggregatedData;
        }

        if (budgetData) {
            const yearlyAggregatedData = aggregateByYear(budgetData);
            const monthlyAggregatedData = aggregateByMonth(budgetData);
            const yl = [], yd = [], ml = [], md = [];
            for (const year of years) {
                for (const month of monthOptions) {
                    const monthYear = `${month.value}/${year.value}`;
                    if (monthlyAggregatedData[monthYear]) {
                        ml.push(`${month.name}-${year.value}`);
                        md.push(monthlyAggregatedData[monthYear]?.totalBudget);
                    }
                }
                yl.push(year.value);
                yd.push(yearlyAggregatedData[year.value]?.totalBudget);
            }

            setYearlyAggData(yd);
            setYearlyAggLabels(yl);
            setMonthlyAggLabels(ml);
            setMonthlyAggData(md);
        }
    }, [budgetData])


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
        return <Bar options={options} data={data} height={400} width={400} />
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
        return <Pie data={data} options={options} height={300} width={300} />
    }

    const createYearlyAggChart = () => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
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
                    text: 'Yearly Aggregated Data Of Personal Budget',
                },
            },
        };
        const data = {
            datasets: [
                {
                    label: 'budget',
                    data: yearlyAggData,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                }
            ],
            labels: yearlyAggLabels,
        }
        return <Line options={options} data={data} />
    }
    const createMonthlyAggChart = () => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
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
                    text: 'Monthly Aggregated Data Of Personal Budget',
                },
            },
        };
        const data = {
            datasets: [
                {
                    label: 'budget',
                    data: monthlyAggData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
            labels: monthlyAggLabels,
        }
        return <Line options={options} data={data} />
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
            <div className="barchartstyle">
                <div className="stylechart">
                    {createYearlyAggChart()}
                </div>
                <div className="stylechart ml-4">
                    {createMonthlyAggChart()}
                </div>
            </div>
        </div>
    )
};

export default Dashboard;