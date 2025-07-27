  // Navigation menu functionality
        function initNavigation() {
            const navToggle = document.getElementById('navToggle');
            const mobileMenu = document.getElementById('mobileMenu');
            const navLinks = document.querySelectorAll('.nav-link');

            // Mobile menu toggle
            navToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    navToggle.textContent = '☰';
                }
            });

            // Handle navigation link clicks
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    navLinks.forEach(l => l.classList.remove('active'));
                    
                    // Add active class to clicked link
                    link.classList.add('active');
                    
                    // Close mobile menu if open
                    mobileMenu.classList.remove('active');
                    navToggle.textContent = '☰';
                    
                    // Handle different navigation actions
                    const linkText = link.textContent.trim();
                    switch(linkText) {
                        case '🏠 Convert':
                            // Already on converter page
                            break;
                        case '📊 Charts':
                            // Scroll to chart section
                            document.querySelector('.chart-section').scrollIntoView({ 
                                behavior: 'smooth' 
                            });
                            break;
                        case '📈 Rates':
                            showNotification('Live rates feature coming soon!', 'info');
                            break;
                        case '📱 API':
                            showNotification('API documentation coming soon!', 'info');
                            break;
                        case 'ℹ️ About':
                            showAboutModal();
                            break;
                    }
                });
            });
        }
        // Set current year dynamically
document.getElementById('currentYear').textContent = new Date().getFullYear();

        // Show notification function
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            const colors = {
                info: '#007bff',
                success: '#28a745',
                warning: '#ffc107',
                error: '#dc3545'
            };
            
            notification.style.cssText = `
                position: fixed;
                top: 90px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1001;
                font-size: 14px;
                font-weight: 500;
                max-width: 300px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 4 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 4000);
        }

        // Show about modal
        function showAboutModal() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1002;
                backdrop-filter: blur(4px);
            `;
            
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 500px;
                margin: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                text-align: center;
            `;
            
            modalContent.innerHTML = `
                <h2 style="margin-bottom: 20px; color: #333;">💱 CurrencyConvert</h2>
                <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                    A modern, responsive currency converter built with real-time exchange rates from ExchangeRate-API. 
                    Convert between 170+ currencies with beautiful charts and live data.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
                    <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Real-time Rates</span>
                    <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px;">170+ Currencies</span>
                    <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Interactive Charts</span>
                    <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Mobile Responsive</span>
                </div>
                <button id="closeModal" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: transform 0.2s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Close
                </button>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Close modal functionality
            document.getElementById('closeModal').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        }
        const API_KEY = 'YOUR API'; // Replace with your actual API key
        const BASE_URL = 'https://v6.exchangerate-api.com/v6';
        
        // Cache for storing exchange rates and currencies to minimize API calls
        let exchangeRatesCache = {};
        let supportedCurrencies = {};
        let cacheTimestamp = 0;
        let currenciesTimestamp = 0;
        const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
        const CURRENCIES_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

        // Debounce utility for input handling
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Loading state management
        function setLoading(isLoading, skipInputDisabling = false) {
            if (!skipInputDisabling) {
                const elements = ['fromCurrency', 'toCurrency', 'swapBtn'];
                elements.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.disabled = isLoading;
                });
            }
            
            if (isLoading) {
                document.getElementById('exchangeRate').textContent = 'Loading...';
                // Don't change the input value while user is typing
                if (!skipInputDisabling) {
                    document.getElementById('toAmount').value = 'Loading...';
                }
            }
        }

        // Fetch supported currencies from API
        async function fetchSupportedCurrencies() {
            const now = Date.now();
            
            // Check if we have cached currencies that are still valid
            if (Object.keys(supportedCurrencies).length > 0 && (now - currenciesTimestamp) < CURRENCIES_CACHE_DURATION) {
                return supportedCurrencies;
            }

            try {
                const response = await fetch(`${BASE_URL}/${API_KEY}/codes`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.result === 'success') {
                    // Convert array of codes to object for easier lookup
                    supportedCurrencies = {};
                    data.supported_codes.forEach(([code, name]) => {
                        supportedCurrencies[code] = name;
                    });
                    
                    currenciesTimestamp = now;
                    return supportedCurrencies;
                } else {
                    throw new Error(data['error-type'] || 'API Error');
                }
            } catch (error) {
                console.error('Error fetching supported currencies:', error);
                
                // Return fallback currencies if API fails
                if (Object.keys(supportedCurrencies).length === 0) {
                    supportedCurrencies = {
                        'USD': 'United States Dollar',
                        'EUR': 'Euro',
                        'GBP': 'British Pound Sterling',
                        'ZAR': 'South African Rand',
                        'JPY': 'Japanese Yen',
                        'CAD': 'Canadian Dollar',
                        'AUD': 'Australian Dollar',
                        'CHF': 'Swiss Franc',
                        'CNY': 'Chinese Yuan',
                        'INR': 'Indian Rupee'
                    };
                }
                
                return supportedCurrencies;
            }
        }

        // Populate currency select options
        async function populateCurrencySelects() {
            try {
                const currencies = await fetchSupportedCurrencies();
                const fromSelect = document.getElementById('fromCurrency');
                const toSelect = document.getElementById('toCurrency');
                
                // Clear existing options
                fromSelect.innerHTML = '';
                toSelect.innerHTML = '';
                
                // Get popular currencies first
                const popularCurrencies = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
                const otherCurrencies = Object.keys(currencies).filter(code => !popularCurrencies.includes(code)).sort();
                
                // Combine popular currencies first, then others
                const orderedCurrencies = [...popularCurrencies.filter(code => currencies[code]), ...otherCurrencies];
                
                orderedCurrencies.forEach(code => {
                    const name = currencies[code];
                    
                    // Create option for "from" currency
                    const fromOption = document.createElement('option');
                    fromOption.value = code;
                    fromOption.textContent = `${code} - ${name}`;
                    fromSelect.appendChild(fromOption);
                    
                    // Create option for "to" currency
                    const toOption = document.createElement('option');
                    toOption.value = code;
                    toOption.textContent = `${code} - ${name}`;
                    toSelect.appendChild(toOption);
                });
                
                // Set default values
                fromSelect.value = 'ZAR';
                toSelect.value = 'USD';
                
            } catch (error) {
                console.error('Error populating currency selects:', error);
                showError('Failed to load currency list');
            }
        }

        // Fetch current exchange rates from API
        async function fetchExchangeRates(baseCurrency) {
            const cacheKey = baseCurrency;
            const now = Date.now();
            
            // Check if we have cached data that's still valid
            if (exchangeRatesCache[cacheKey] && (now - cacheTimestamp) < CACHE_DURATION) {
                return exchangeRatesCache[cacheKey];
            }

            try {
                const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.result === 'success') {
                    exchangeRatesCache[cacheKey] = data.conversion_rates;
                    cacheTimestamp = now;
                    
                    // Update last updated time
                    const lastUpdate = new Date(data.time_last_update_unix * 1000);
                    const formatted = lastUpdate.toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'short' 
                    }) + ', ' + lastUpdate.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                    }) + ' UTC';
                    document.getElementById('lastUpdated').textContent = formatted;
                    
                    return data.conversion_rates;
                } else {
                    throw new Error(data['error-type'] || 'API Error');
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                showError('Failed to fetch exchange rates. Using cached data if available.');
                
                // Return cached data if available, otherwise use fallback
                if (exchangeRatesCache[cacheKey]) {
                    return exchangeRatesCache[cacheKey];
                }
                
                return null;
            }
        }

        // Fetch historical data (ExchangeRate-API doesn't provide historical data in free tier)
        // This function generates realistic historical data based on current rates
        async function generateHistoricalData(baseCurrency, targetCurrency, days) {
            try {
                const rates = await fetchExchangeRates(baseCurrency);
                if (!rates || !rates[targetCurrency]) {
                    throw new Error('Unable to get current rate');
                }
                
                const currentRate = rates[targetCurrency];
                const data = [];
                const now = new Date();
                
                for (let i = days; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    
                    // Generate realistic variation around current rate (±3% max)
                    const maxVariation = 0.03;
                    const variation = (Math.random() - 0.5) * 2 * maxVariation;
                    
                    // Add some trend simulation
                    const trendFactor = Math.sin((i / days) * Math.PI * 2) * 0.01;
                    const rate = currentRate * (1 + variation + trendFactor);
                    
                    data.push({
                        date: date.toISOString().split('T')[0],
                        rate: parseFloat(Math.max(0, rate).toFixed(2))
                    });
                }
                
                return data;
            } catch (error) {
                console.error('Error generating historical data:', error);
                return [];
            }
        }

        // Show error message
        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                max-width: 300px;
                font-size: 14px;
            `;
            errorDiv.textContent = message;
            
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }

        // Chart setup
        let chart;
        const ctx = document.getElementById('rateChart').getContext('2d');

        async function initChart() {
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            
            try {
                const data = await generateHistoricalData(fromCurrency, toCurrency, 30);
                
                if (chart) {
                    chart.destroy();
                }

                chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map(d => d.date),
                        datasets: [{
                            label: `${fromCurrency}/${toCurrency}`,
                            data: data.map(d => d.rate),
                            borderColor: '#007bff',
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.1,
                            pointRadius: 0,
                            pointHoverRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                display: true,
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    maxTicksLimit: 6,
                                    callback: function(value, index, values) {
                                        const date = new Date(this.getLabelForValue(value));
                                        return date.toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        });
                                    }
                                }
                            },
                            y: {
                                display: true,
                                grid: {
                                    color: '#f1f3f4'
                                },
                                ticks: {
                                    maxTicksLimit: 6,
                                    callback: function(value) {
                                        return value.toFixed(2);
                                    }
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        }
                    }
                });
            } catch (error) {
                console.error('Error initializing chart:', error);
                showError('Failed to load chart data');
            }
        }

        // Currency conversion with improved focus handling
        async function convertCurrency(skipInputDisabling = false) {
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            const fromAmount = parseFloat(document.getElementById('fromAmount').value) || 0;
            
            if (!fromCurrency || !toCurrency) {
                return; // Wait for currencies to load
            }
            
            if (fromCurrency === toCurrency) {
                document.getElementById('toAmount').value = fromAmount.toFixed(2);
                document.getElementById('exchangeRate').textContent = '1.00';
                updateTitle();
                return;
            }
            
            // Store the currently focused element
            const activeElement = document.activeElement;
            
            setLoading(true, skipInputDisabling);
            
            try {
                const rates = await fetchExchangeRates(fromCurrency);
                
                if (rates && rates[toCurrency]) {
                    const rate = rates[toCurrency];
                    const convertedAmount = fromAmount * rate;
                    
                    document.getElementById('toAmount').value = convertedAmount.toFixed(2);
                    document.getElementById('exchangeRate').textContent = rate.toFixed(2);
                    
                    // Calculate and display rate change (mock calculation)
                    const rateChangeElement = document.getElementById('rateChange');
                    const changePercent = ((Math.random() - 0.5) * 4).toFixed(1); // Mock change
                    const changeValue = (rate * (changePercent / 100)).toFixed(2);
                    const isPositive = changePercent > 0;
                    
                    rateChangeElement.className = `rate-change ${isPositive ? 'positive' : 'negative'}`;
                    rateChangeElement.innerHTML = `
                        <span>${isPositive ? '↗' : '↘'}</span> 
                        ${Math.abs(changeValue)} (${Math.abs(changePercent)}%)
                    `;
                } else {
                    throw new Error('Rate not available');
                }
            } catch (error) {
                console.error('Error converting currency:', error);
                if (!skipInputDisabling) {
                    showError('Failed to convert currency. Please try again.');
                }
                document.getElementById('toAmount').value = '0.00';
                document.getElementById('exchangeRate').textContent = '0.00';
            } finally {
                setLoading(false, skipInputDisabling);
                
                // Restore focus to the previously focused element if it was an input
                if (activeElement && activeElement.id === 'fromAmount') {
                    setTimeout(() => {
                        activeElement.focus();
                        // Restore cursor position to the end
                        const length = activeElement.value.length;
                        activeElement.setSelectionRange(length, length);
                    }, 0);
                }
                
                updateTitle();
            }
        }

        // Debounced version for input events
        const debouncedConvertCurrency = debounce(() => convertCurrency(true), 300);

        function updateTitle() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (!fromCurrency || !toCurrency) return;
    
    const fromCurrencyName = supportedCurrencies[fromCurrency] || fromCurrency;
    const toCurrencyName = supportedCurrencies[toCurrency] || toCurrency;
    
    document.getElementById('currencyPairTitle').textContent = `1 ${fromCurrencyName} equals`;
    document.title = `Convert ${fromCurrency} to ${toCurrency} | Real-Time ${fromCurrency}/${toCurrency} Exchange Rate`;
}

        function swapCurrencies() {
            const fromCurrency = document.getElementById('fromCurrency');
            const toCurrency = document.getElementById('toCurrency');
            const fromAmount = document.getElementById('fromAmount');
            const toAmount = document.getElementById('toAmount');
            
            // Swap currency selections
            const tempCurrency = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = tempCurrency;
            
            // Swap amounts
            const tempAmount = fromAmount.value;
            fromAmount.value = toAmount.value;
            toAmount.value = tempAmount;
            
            convertCurrency();
            initChart();
        }

        async function updateTimeFilter(period) {
    // Remove active class and aria-selected from all buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    // Add active class and aria-selected to clicked button
    const activeButton = document.querySelector(`[data-period="${period}"]`);
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');
    
    // Update chart data based on period
    const days = {
        '1D': 1,
        '5D': 5,
        '1M': 30,
        '1Y': 365,
        '5Y': 1825,
        'Max': 3650
    };
    
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    try {
        const data = await generateHistoricalData(fromCurrency, toCurrency, days[period]);
        
        if (chart && data.length > 0) {
            chart.data.labels = data.map(d => d.date);
            chart.data.datasets[0].data = data.map(d => d.rate);
            chart.update();
        }
    } catch (error) {
        console.error('Error updating chart:', error);
        showError('Failed to update chart data');
    }
}

        // Event listeners
        document.getElementById('fromAmount').addEventListener('input', debouncedConvertCurrency);
        document.getElementById('fromCurrency').addEventListener('change', () => {
            convertCurrency();
            initChart();
        });
        document.getElementById('toCurrency').addEventListener('change', () => {
            convertCurrency();
            initChart();
        });
        document.getElementById('swapBtn').addEventListener('click', swapCurrencies);

        // Time filter buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                updateTimeFilter(e.target.dataset.period);
            });
        });

        // Initialize the application
        async function initializeApp() {
            try {
                setLoading(true);
                
                // Initialize navigation
                initNavigation();
                
                // First, populate the currency lists
                await populateCurrencySelects();
                
                // Then perform initial conversion and load chart
                await convertCurrency();
                await initChart();
                
                // Show success message
                showNotification(`Loaded ${Object.keys(supportedCurrencies).length} currencies successfully!`, 'success');
                
            } catch (error) {
                console.error('Error initializing app:', error);
                showError('Failed to initialize application. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        }

        // Start the application
        initializeApp(
            
        );

        // Auto-refresh rates every 5 minutes
        setInterval(() => {
            convertCurrency(true); // Skip input disabling for background updates
        }, 5 * 60 * 1000);


        // FAQ Accordion
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const faq = button.parentElement;
                const answer = faq.querySelector('.faq-answer');

                faq.classList.toggle('active');

                if (faq.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });

        // privacy policy modal
function showPrivacyModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1002;
        backdrop-filter: blur(4px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 600px;
        max-height: 80vh;
        margin: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #333; text-align: center;">🔒 Privacy Policy</h2>
        <div style="color: #666; line-height: 1.6; text-align: left;">
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Data Collection</h3>
            <p style="margin-bottom: 15px;">We do not collect, store, or transmit any personal information directly. All currency conversions are performed using public exchange rate APIs.</p>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Analytics & Tracking</h3>
            <p style="margin-bottom: 10px;">We use Google Analytics to understand how visitors interact with our website. Google Analytics collects information such as:</p>
            <ul style="margin: 10px 0 15px 20px; padding: 0;">
                <li style="margin-bottom: 5px;">Pages visited and time spent on site</li>
                <li style="margin-bottom: 5px;">Device and browser information</li>
                <li style="margin-bottom: 5px;">General geographic location (city/country level)</li>
                <li style="margin-bottom: 5px;">How you arrived at our website</li>
            </ul>
            <p style="margin-bottom: 15px;">This data is anonymized and used solely to improve our service. You can opt out of Google Analytics tracking by using browser extensions or adjusting your browser settings.</p>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Exchange Rate Data</h3>
            <p style="margin-bottom: 15px;">Exchange rates are fetched from ExchangeRate-API and cached temporarily in your browser for performance. This data is not stored on our servers.</p>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Cookies</h3>
            <p style="margin-bottom: 15px;">We use cookies through Google Analytics for tracking website usage and performance. These cookies do not contain personally identifiable information.</p>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Third-Party Services</h3>
            <p style="margin-bottom: 10px;">We use the following third-party services:</p>
            <ul style="margin: 10px 0 15px 20px; padding: 0;">
                <li style="margin-bottom: 5px;"><strong>ExchangeRate-API</strong> - For currency exchange rate data</li>
                <li style="margin-bottom: 5px;"><strong>Google Analytics</strong> - For website analytics and performance tracking</li>
            </ul>
            <p style="margin-bottom: 15px;">Please refer to their respective privacy policies for information about their data practices.</p>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Data Retention</h3>
            <p style="margin-bottom: 15px;">Google Analytics data is retained according to Google's data retention policies. Exchange rate data is cached locally in your browser and automatically expires.</p>
            
            <h3 style="color: #495057; margin: 20px 0 10px 0;">Contact</h3>
            <p style="margin-bottom: 20px;">For any privacy concerns or questions about data handling, please contact us through our website.</p>
            
            <p style="font-size: 12px; color: #868e96; margin-top: 25px; text-align: center;">Last updated: ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="text-align: center;">
            <button id="closePrivacyModal" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: transform 0.2s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Close
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal functionality
    document.getElementById('closePrivacyModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}