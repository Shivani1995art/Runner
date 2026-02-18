import React, { createContext, useState, useEffect,useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '../utils/token';
import { logger } from '../utils/logger';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {};
