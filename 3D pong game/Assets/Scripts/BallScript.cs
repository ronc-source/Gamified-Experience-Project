using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BallScript : MonoBehaviour
{
    public Collider playerGoal;
    public Collider aiGoal;
    public Rigidbody rb;
    public bool goal = false;
    public TextMesh playerScore;
    public TextMesh aiScore;
    public int pScore;
    public int aScore;
    public Canvas space;
    public bool player = false;

    void Start()
    {
        pScore = 0;
        aScore = 0;
        rb.AddForce(randomForce(player), ForceMode.Impulse);
    }

    void Update()
    {
        if (goal)
        {
            space.enabled = true;
            if (Input.GetKeyDown("space")) 
            { 
                rb.AddForce(randomForce(player), ForceMode.Impulse);
                goal = false;
                space.enabled = false;
            }
        }
    }

    Vector3 startVector = new Vector3(0f, 1f, 0f);
    private void OnTriggerEnter(Collider other)
    {
        if (other == playerGoal)
        {
            pointScored();
            player = true;  
            pScore++;
            playerScore.text = pScore.ToString();
        } 
        else
        {
            pointScored();
            player = false;
            aScore++;
            aiScore.text = aScore.ToString();
        }

    }

    public void pointScored()
    {
        transform.position = startVector;
        rb.velocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;
        goal = true;
    }

    public Vector3 randomForce(bool player)
    {

        if (player)
        {
            Vector3 playerImpulse = new Vector3(Random.Range(-10.0f, 10.0f), 0, Random.Range(-10f, -20.0f));
            return playerImpulse;
        }
        else
        {
            Vector3 aiImpulse = new Vector3(Random.Range(-10.0f, 10.0f), 0, Random.Range(10f, 20.0f));
            return aiImpulse;
        }

    }
}
