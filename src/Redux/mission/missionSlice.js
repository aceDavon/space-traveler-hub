import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMissions = createAsyncThunk('mission/fetchMissions', async () => {
  try {
    const data = await axios.get('https://api.spacexdata.com/v3/missions');
    return data.data;
  } catch (error) {
    return error.message;
  }
});

const MissionSlice = createSlice({
  name: 'missions',
  initialState: { mission: [], status: 'idle' },
  reducers: {
    missionStatus: (state, { payload }) => {
      const data = state.mission.map((x) => (x.mission_id === payload
        ? { ...x, joined: !x.joined }
        : x));
      return {
        ...state,
        mission: data,
      };
    },
  },
  extraReducers: (Builder) => {
    Builder
      .addCase(fetchMissions.pending, (state) => ({
        ...state,
        status: 'pending',
      }))
      .addCase(fetchMissions.fulfilled, (state, action) => {
        const data = [];
        action.payload.map((x) => {
          const { mission_id, description, mission_name } = x;
          data.push({
            mission_id, description, mission_name, joined: false,
          });
          return data;
        });
        return {
          ...state,
          mission: data,
          status: 'idle',
        };
      })
      .addCase(fetchMissions.rejected, (state, { error }) => ({
        ...state,
        status: error,
      }));
  },
});

export const { missionStatus } = MissionSlice.actions;
export const selectAllMissions = (state) => state.mission;

export default MissionSlice.reducer;
