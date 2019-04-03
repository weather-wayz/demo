import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';
import TopBanner from '../../components/TopBanner';
import { Modal } from 'react-native';

export default class HistoryScreen extends React.Component {

	// set up navigation
	static navigationOptions = {
		title: 'HISTORY',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'HISTORY',
			username: 'hcx',
			daysHavePost: [],
		};
	}

	// functions that runs whenever HistoryPage is re-rendered in DOM
	componentWillMount() {
		this.getAllPosts();
	}

	// function to get all posts 
	getAllPosts = async () => {
		try {
			let response = await fetch('http://3.93.183.130:3000/allposts/' + this.state.username, { method: 'GET' })
			let responseJson = await response.json();
			for (responseItem of responseJson) {
				// distinguish if it is an outfit post or weather post, create post object
				if (responseItem.weather_post_id) {
					post = {
						postId: responseItem.weather_post_id,
						postType: 'weather',
						image: responseItem.photo,
						location: responseItem.location,
						temperature: responseItem.temperature,
						humidity: responseItem.humidity,
						cloud: responseItem.cloud,
						wind: responseItem.wind,
					}
				} else {
					post = {
						postId: responseItem.outlook_post_id,
						postType: 'outfit',
						image: responseItem.photo,
					}
				}
				// change date format
				let fromDate = responseItem.date.split("-")
				let rawDate = new Date(fromDate[0], fromDate[1] - 1, fromDate[2])
				let formattedDate = moment(rawDate).format('ll')
				// check if we have already stored a specific day object, whose date attribute matches the date of the new post object just created
				let dayHasPost = this.state.daysHavePost.find((day) => {
					return day.date == formattedDate;
				});
				// if already stored, push new post object into the posts array attribute of that day object
				if (dayHasPost) {
					dayHasPost.posts.push(post);
				} else { 
					// if not stored, create a new day object, whose date attribute equals to the date of the new post object
					// and the store the new post object into into the posts array attribute
					let day = {
						date: formattedDate,
						posts: [
							post,
						],
					}
					this.state.daysHavePost.push(day);
				}
			}
			// update state
			this.setState({
				daysHavePost: this.state.daysHavePost,
			});
		} catch (error) {
			console.error(error);
		}
	}

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<History 
					ref={ref => this.scrollView = ref}
					onContentSizeChange={(contentWidth, contentHeight)=>{
						this.scrollView.scrollToEnd({animated: false});
					}}>
						{this.state.daysHavePost.map((dayItem, dayKey) => {
							return (
								<DailyPosts key={dayKey}>
									<DateWrapper>
										<DateText>{dayItem.date}</DateText>
									</DateWrapper>
									<Posts horizontal={true} showsHorizontalScrollIndicator={false}>
										{dayItem.posts.map((postItem, postKey) => {
											return (
												<Post key={postKey}>
													<PostImage source={{ uri: 'data:image/png;base64,' + postItem.image }} />
												</Post>
											);
										})}
									</Posts>
								</DailyPosts>
							);
						})}
					</History>
					{/* put components with absolute position at the bottom */}
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
				</Container>
			</SafeAreaView>
		);
	}
}

// css
const Container = styled.View`
  height: 100%;
	width: 100%;
	background-color: whitesmoke;
	padding-bottom: 45;
`;

const History = styled.ScrollView`
  top: 45px;
	width: 100%;
	background-color: white;
`;

const DailyPosts = styled.View`
	width: 100%;
	height: 138px;
	flex-direction: column;
`;

const DateWrapper = styled.View`
	flex: 1;
	margin-left: 15px;
	margin-right: 15px;
	border-bottom-width: 1;
	border-bottom-color: gainsboro;
	justify-content: flex-end;
`;

const DateText = styled.Text`
  font-size: 12.5px;
	font-family: Georgia;
	color: black;
`;

const Posts = styled.ScrollView`
	flex: 5;
	overflow: visible;
`;

const Post = styled.TouchableOpacity`
	height: 105px;
	width: 105px;
	margin-left: 15px;
	margin-top: 5px;
`;

const PostImage = styled.Image`
	height: 105px;
	width: 105px;
	resize-mode: stretch;
	border-radius: 5px;
`;