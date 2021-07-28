import React from 'react'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {loginTC} from '../state/auth-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {Redirect} from 'react-router-dom';

export const Login = () => {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string()
                .min(4, 'Must be 4 characters or more')
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
        }),
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })

    if (isLoggedIn) {
        return <Redirect to={'/'} />
    }

    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'} rel="noreferrer">here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            style={{height: '60px'}}
                            required
                            fullWidth
                            label="Email"
                            margin="normal"
                            helperText={formik.touched.email && formik.errors.email}
                            error={formik.touched.email && !!formik.errors.email}
                            {...formik.getFieldProps('email')}
                        />

                        <TextField
                            style={{height: '60px'}}
                            required
                            fullWidth
                            type="password"
                            label="Password"
                            margin="normal"
                            helperText={formik.touched.password && formik.errors.password}
                            error={formik.touched.password && !!formik.errors.password}
                            {...formik.getFieldProps('password')}
                        />

                        <FormControlLabel
                            label={'Remember me'}
                            control={
                                <Checkbox
                                    checked={formik.values.rememberMe}
                                    {...formik.getFieldProps('rememberMe')}
                                />
                            }
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
