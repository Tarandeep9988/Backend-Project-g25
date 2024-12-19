const form = document.getElementById('registrationForm');
const message = document.getElementById('message');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const formData = {
        username: form.username.value,
        password: form.password.value,
        dob: form.dob.value,
    };

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            message.textContent = 'Registration successful!';
            form.reset();
        }
        else {
            message.textContent = 'Registration failed';
        }
    }
    catch (err) {
        console.error(err);
        message.textContent = 'An error occurred.';
    }
});